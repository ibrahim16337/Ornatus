const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const admin = require("../../middlewares/admin");
const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', 
  database: 'Furniture',
  password: 'lxo8999',
  port: 5432, 
});
router.get("/", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM product_review');
      const reviews = result.rows;
      client.release();
      return res.send(reviews);
    } catch (error) {
      console.error("Error retrieving reviews:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  router.get("/:id", async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM product_review WHERE timestamp_id = $1', [req.params.id]);
      const review = result.rows[0];
      client.release();
  
      if (!review) {
        return res.status(400).send("Review with given ID is not present");
      }
  
      return res.send(review);
    } catch (error) {
      console.error("Error retrieving review:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  router.get("/product/:id", async (req, res) => {
    console.log("From the API fetching review by product Id")
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM product_review WHERE product_id = $1', [req.params.id]);
      const review = result.rows;
      client.release();
      console.log(review);
      if (!review) {
        return res.status(400).send("Review with given ID is not present");
      }
  
      return res.send(review);
    } catch (error) {
      console.error("Error retrieving review:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  
  router.put("/:id", auth, async (req, res) => {
    try {
      const client = await pool.connect();
      const { review, rating, title } = req.body;
      await client.query('UPDATE product_review SET review = $1, rating = $2, title = $3 WHERE timestamp_id = $4', [review, rating, title, req.params.id]);
      client.release();
      
      return res.send("Review updated successfully");
    } catch (error) {
      console.error("Error updating review:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  
  router.delete("/:id", auth, admin, async (req, res) => {
    try {
      const client = await pool.connect();
      await client.query('DELETE FROM product_review WHERE timestamp_id = $1', [req.params.id]);
      client.release();
  
      return res.send("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting review:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  
  router.post("/", async (req, res) => {
    try {
      const client = await pool.connect();
      const { product_id, user_id, review, rating, title } = req.body;
      console.log(req.body);
      console.log('From the API the values are as ',product_id,user_id,review,rating,title);
      await client.query('INSERT INTO product_review (product_id, user_id, review, rating, title) VALUES ($1, $2, $3, $4, $5)', [product_id, user_id, review, rating, title]);
      client.release();
  
      return res.send("Review inserted successfully");
    } catch (error) {
      console.error("Error inserting review:", error);
      return res.status(500).send("Internal Server Error");
    }
  });
  
  module.exports = router;
  