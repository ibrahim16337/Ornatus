const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const Stripe = require("stripe");

// Neon/Vercel SSL fix (set PG_SSL=true in Vercel env vars)
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Base URL for redirects after Stripe checkout
// In production set CLIENT_URL to your deployed Front-end URL (Vercel)
const CLIENT_URL = (process.env.CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Stripe checkout session
 * NOTE: Don't initialize stripe at import-time with possibly-missing env vars.
 */
router.post("/create-checkout-session", async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET) {
      return res.status(500).send("Stripe secret key is missing in environment variables.");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET);

    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).send("Products are required.");
    }

    const lineItems = products.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.title,
          images: product.image ? [product.image] : [],
        },
        unit_amount: Math.round(Number(product.price) * 100),
      },
      quantity: Number(product.quantity) || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${CLIENT_URL}/checkout`,
      cancel_url: `${CLIENT_URL}/login`,
    });

    return res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return res.status(500).send("Failed to create Stripe checkout session.");
  }
});

// GET all orders
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    return res.json({ data: result.rows, total: result.rows.length });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET orders by user
router.get("/user/:user_id", async (req, res) => {
  try {
    const userId = req.params.user_id;

    const result = await pool.query("SELECT * FROM orders WHERE user_id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).send("No orders found for this user.");
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("Error retrieving orders for user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// GET single order by ID
// Your insert returns timestamp_id, and update uses timestamp_id, so keep it consistent:
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders WHERE timestamp_id = $1", [req.params.id]);

    const order = result.rows[0];
    if (!order) {
      return res.status(404).send("Order with given ID is not present");
    }

    return res.json(order);
  } catch (error) {
    console.error("Error retrieving order:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// CREATE order (transaction)
router.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const { user_id, amount, items } = req.body;

    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, amount) VALUES ($1, $2) RETURNING timestamp_id",
      [user_id, amount]
    );

    const orderId = orderResult.rows[0].timestamp_id;

    for (const item of items || []) {
      await client.query(
        "INSERT INTO order_items (orderid, productid, quantity) VALUES ($1, (SELECT timestamp_id FROM products WHERE id=$2), $3);",
        [orderId, item.id, item.quantity]
      );
    }

    await client.query("COMMIT");
    return res.status(201).json({ order_id: orderId });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", error);
    return res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
});

// UPDATE order
router.put("/:id", async (req, res) => {
  try {
    const { user_id, amount } = req.body;

    const result = await pool.query(
      "UPDATE orders SET user_id = $1, amount = $2 WHERE timestamp_id = $3 RETURNING *",
      [user_id, amount, req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send("Order with given ID is not present");
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// DELETE order (keep consistent with timestamp_id)
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM orders WHERE timestamp_id = $1 RETURNING *", [
      req.params.id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).send("Order with given ID is not present");
    }

    return res.send("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
