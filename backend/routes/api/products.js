const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { Pool } = require("pg");

// Create a new Pool instance for PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // Or your PostgreSQL host
  database: 'Furniture',
  password: 'lxo8999',
  port: 5432, // Default PostgreSQL port
});

// GET all products or products by category

router.get("/", async (req, res) => {
  try {
    const client = await pool.connect();
    let categoryName = req.query.category;
    let sortBy = req.query.sortBy || 'name';
    let sortOrder = req.query.sortOrder || 'asc';
    let availability = req.query.availability || '';
    console.log(categoryName, sortBy, sortOrder, availability);

    // Construct the base query
    let query = `SELECT * FROM products`;

    // Check if a category name is provided
    if (categoryName && categoryName.toLowerCase() !== 'all') {
      // Fetch category_id based on category name
      let categoryIdQuery = `SELECT timestamp_id FROM categories WHERE categories = $1`;
      let categoryIdParams = [categoryName];

      const categoryIdResult = await client.query(categoryIdQuery, categoryIdParams);
      const categoryId = categoryIdResult.rows.length > 0 ? categoryIdResult.rows[0].timestamp_id : null;
      console.log("Category ID:", categoryId);

      if (categoryId) {
        query += ` WHERE category_id = '${categoryId}'`;
      } else {
        // If category not found, check if it exists in the styles table
        let styleIdQuery = `SELECT timestamp_id FROM styles WHERE style = $1`;
        let styleIdParams = [categoryName];

        const styleIdResult = await client.query(styleIdQuery, styleIdParams);
        const styleId = styleIdResult.rows.length > 0 ? styleIdResult.rows[0].timestamp_id : null;
        console.log("Style ID:", styleId);

        if (styleId) {
          query += ` WHERE style_id = '${styleId}'`;
        } else {
          // If category and style not found, fetch all products
          categoryName = 'all';
        }
      }
    }

    // Check if availability filter is provided
    if (availability && availability.toLowerCase() !== 'all') {
      // Add availability filter to the query
      if (query.includes('WHERE')) {
        query += ` AND`;
      } else {
        query += ` WHERE`;
      }
      if (availability === 'In Stock') {
        query += ` stock > 0`;
      } else if (availability === 'Out of Stock') {
        query += ` stock <= 0`;
      }
    }

    // Add sorting to the query
    query += ` ORDER BY ${sortBy} ${sortOrder}`;
    console.log("Final Query:", query);

    const result = await client.query(query);
    const products = {
      data: result.rows,
      total: result.rows.length
    };
    client.release();

    return res.send(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Search products
router.get("/search", async (req, res) => {
  try {
    const client = await pool.connect();
    const searchTerm = req.query.searchTerm;
    const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
    console.log("Search Query:", query);

    const result = await client.query(query);
    const products = result.rows;
    client.release();

    return res.send(products);
  } catch (error) {
    console.error("Error searching products:", error);
    return res.status(500).send("Internal Server Error");
  }
});


router.get("/get-by-id/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM products WHERE id = $1`, [req.params.id]);
    const product = result.rows[0];
    client.release();

    if (!product) {
      return res.status(400).send("Product with given ID is not present"); // When id is not present in db
    }
    return res.send({
      data: product
    }); // Everything is ok
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM products WHERE timestamp_id = $1`, [req.params.id]);
    const product = result.rows[0];
    client.release();

    if (!product) {
      return res.status(400).send("Product with given ID is not present"); // When id is not present in db
    }

    return res.send(product); // Everything is ok
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).send("Internal Server Error");
  }
});
// GET single product By Name
router.get("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM products WHERE name = $1`, [req.params.name]);
    const product = result.rows[0];
    client.release();

    if (!product) {
      return res.status(400).send("Product with given Name is not present"); // When id is not present in db
    }

    return res.send(product); // Everything is ok
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).send("Internal Server Error");
  }
});
// Update a record
router.put("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`UPDATE products SET id=$1, timestamp_id=$2, name=$3, category_id=$4, style_id=$5, price=$6, description=$7, stock=$8, image=$9
    WHERE id = $10`, [ req.body.id, req.body.timestamp_id, req.body.name,req.body.category_id,req.body.style_id, req.body.price,req.body.description,req.body.stock,req.body.image, req.params.id]);
    client.release();

    return res.send("Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Delete a record
router.delete("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM products WHERE id = $1`, [req.params.id]);
    client.release();

    return res.send("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Insert a record
router.post("/", async (req, res) => {
  try {
    const client = await pool.connect();
    const body = req.body.data
    console.log(body)
    await client.query(`INSERT INTO products(
      name, category_id, style_id, price, description, stock)
      VALUES ($1, $2 , $3 , $4 , $5, $6)`, [body.name, body.category, body.style, body.price, body.description, body.stock]);
    client.release();

    // sending some dummy data in response, because react-admin expects response in this format
    return res.send({
      data: {
        id: 123,
        name: "product"
      }
    });
  } catch (error) {
    console.error("Error inserting product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
