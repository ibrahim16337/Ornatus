const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
  // Neon/Vercel SSL fix (set PG_SSL=true in Vercel env vars)
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product_review");
    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// ✅ IMPORTANT: this MUST be above "/:id"
router.get("/product/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM product_review WHERE product_id = $1",
      [req.params.id]
    );

    // If none found, return empty array (normal for “no reviews yet”)
    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving reviews for product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET single review by timestamp_id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM product_review WHERE timestamp_id = $1",
      [req.params.id]
    );

    const review = result.rows[0];
    if (!review) {
      return res.status(404).send("Review with given ID is not present");
    }

    return res.json(review);
  } catch (error) {
    console.error("Error retrieving review:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// UPDATE review
router.put("/:id", auth, async (req, res) => {
  try {
    const { review, rating, title } = req.body;

    const result = await pool.query(
      "UPDATE product_review SET review = $1, rating = $2, title = $3 WHERE timestamp_id = $4 RETURNING *",
      [review, rating, title, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Review with given ID is not present");
    }

    return res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// DELETE review
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM product_review WHERE timestamp_id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Review with given ID is not present");
    }

    return res.send("Review deleted successfully");
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// INSERT review
router.post("/", async (req, res) => {
  try {
    const { product_id, user_id, review, rating, title } = req.body;

    const result = await pool.query(
      "INSERT INTO product_review (product_id, user_id, review, rating, title) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [product_id, user_id, review, rating, title]
    );

    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error inserting review:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
