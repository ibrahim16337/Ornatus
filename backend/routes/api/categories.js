const express = require("express");
let router = express.Router();
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

// GET all categories
router.get("/", async (req, res) => {
  try {
    
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM categories`);
    const categories = result.rows;
    client.release();

    console.log("Total Products", categories);    
    return res.send( categories );
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET single category
router.get("/:id", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM categories WHERE id = $1`, [req.params.id]);
    const category = result.rows[0];
    client.release();

    if (!categories) {
      return res.status(400).send("Category with given ID is not present"); // When id is not present in db
    }

    return res.send(category); // Everything is ok
  } catch (error) {
    console.error("Error retrieving product:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Update a record
router.put("/:id", auth, admin, async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`UPDATE categories SET category = $1`, [req.body.category]);
    client.release();
    
    return res.send("Category updated successfully");
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Delete a record
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`DELETE FROM categories WHERE id = $1`, [req.params.id]);
    client.release();

    return res.send("Category deleted successfully");
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// Insert a record
router.post("/", auth, async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query(`INSERT INTO categories (name) VALUES ($1)`, [req.body.name]);
    client.release();

    return res.send("Category inserted successfully");
  } catch (error) {
    console.error("Error inserting category:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
