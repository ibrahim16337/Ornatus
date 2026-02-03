const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { Pool } = require("pg");

// Neon/Vercel SSL fix (set PG_SSL=true in Vercel env vars)
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Only allow sorting by these columns (prevents SQL injection)
const ALLOWED_SORT_COLUMNS = new Set([
  "name",
  "price",
  "stock",
  "id",
  "timestamp_id",
]);

const normalizeSortOrder = (value) => {
  return String(value || "asc").toLowerCase() === "desc" ? "DESC" : "ASC";
};

// GET all products OR filter by category/style/availability + sorting
// /api/products?category=Chair&availability=In%20Stock&sortBy=price&sortOrder=desc
router.get("/", async (req, res) => {
  try {
    let categoryName = req.query.category;
    let availability = req.query.availability || "";
    let sortBy = req.query.sortBy || "name";
    let sortOrder = normalizeSortOrder(req.query.sortOrder);

    // sanitize sortBy
    if (!ALLOWED_SORT_COLUMNS.has(sortBy)) {
      sortBy = "name";
    }

    const where = [];
    const params = [];
    let p = 1;

    // category/style filter (by name -> get timestamp_id -> filter products)
    if (categoryName && String(categoryName).toLowerCase() !== "all") {
      // Try categories table first
      let categoryId = null;
      const catRes = await pool.query(
        "SELECT timestamp_id FROM categories WHERE categories = $1",
        [categoryName]
      );
      if (catRes.rows.length > 0) categoryId = catRes.rows[0].timestamp_id;

      if (categoryId) {
        where.push(`category_id = $${p++}`);
        params.push(categoryId);
      } else {
        // Try styles table next
        let styleId = null;
        const styleRes = await pool.query(
          "SELECT timestamp_id FROM styles WHERE style = $1",
          [categoryName]
        );
        if (styleRes.rows.length > 0) styleId = styleRes.rows[0].timestamp_id;

        if (styleId) {
          where.push(`style_id = $${p++}`);
          params.push(styleId);
        }
      }
    }

    // availability filter
    if (availability && String(availability).toLowerCase() !== "all") {
      if (availability === "In Stock") where.push("stock > 0");
      if (availability === "Out of Stock") where.push("stock <= 0");
    }

    let sql = "SELECT * FROM products";
    if (where.length) {
      sql += " WHERE " + where.join(" AND ");
    }

    sql += ` ORDER BY ${sortBy} ${sortOrder}`;

    const result = await pool.query(sql, params);

    return res.json({
      data: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Search products safely
// /api/products/search?searchTerm=chair
router.get("/search", async (req, res) => {
  try {
    const searchTerm = String(req.query.searchTerm || "").trim();

    // If empty, return empty array instead of querying everything
    if (!searchTerm) return res.json([]);

    const result = await pool.query(
      "SELECT * FROM products WHERE name ILIKE $1",
      [`%${searchTerm}%`]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// React-admin getOne (your admin panel uses this)
router.get("/get-by-id/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);

    const product = result.rows[0];
    if (!product) {
      return res.status(404).send("Product with given ID is not present");
    }

    return res.json({ data: product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET single product by timestamp_id (keep your existing behavior)
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products WHERE timestamp_id = $1",
      [req.params.id]
    );

    const product = result.rows[0];
    if (!product) {
      return res.status(404).send("Product with given ID is not present");
    }

    return res.json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// UPDATE a record (optional: add auth/admin if you want)
router.put("/:id", async (req, res) => {
  try {
    // keep your existing payload style
    const body = req.body;

    const result = await pool.query(
      `UPDATE products
       SET id=$1, timestamp_id=$2, name=$3, category_id=$4, style_id=$5, price=$6, description=$7, stock=$8, image=$9
       WHERE id = $10
       RETURNING *`,
      [
        body.id,
        body.timestamp_id,
        body.name,
        body.category_id,
        body.style_id,
        body.price,
        body.description,
        body.stock,
        body.image,
        req.params.id,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Product with given ID is not present");
    }

    // react-admin likes { data: ... } but your old code returned a string.
    // returning the updated product is better.
    return res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// DELETE a record
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Product with given ID is not present");
    }

    return res.send("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// INSERT a record (react-admin create)
// expects req.body.data like your current code
router.post("/", async (req, res) => {
  try {
    const body = req.body.data || {};
    console.log(body);

    const result = await pool.query(
      `INSERT INTO products (name, category_id, style_id, price, description, stock)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        body.name,
        body.category,
        body.style,
        body.price,
        body.description,
        body.stock,
      ]
    );

    // Return the inserted row as react-admin expects
    return res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error inserting product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
