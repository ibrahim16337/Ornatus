const express = require("express");
let router = express.Router();
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

// GET all categories
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories");
    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving categories:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [req.params.id]
    );

    const category = result.rows[0];

    if (!category) {
      return res.status(404).send("Category with given ID is not present");
    }

    return res.json(category);
  } catch (error) {
    console.error("Error retrieving category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Update a category (admin only)
router.put("/:id", auth, admin, async (req, res) => {
  try {
    // Your POST uses (name), so update name as well
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("name is required");
    }

    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
      [name, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Category with given ID is not present");
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Delete a category (admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Category with given ID is not present");
    }

    return res.send("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Insert a category (you can add admin here if you want)
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("name is required");
    }

    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
