const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
});


router.post("/create-checkout-session", async(req, res) => {
    const { products } = req.body;
    const lineItems = products.map((product) => {
    console.log(product.title);
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: product.title,
                    images: [product.image]
                },
                unit_amount: Math.round(product.price * 100)
            },
            quantity: product.quantity
        };
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/checkout",
        cancel_url:"http://localhost:3000/login"
    });

    res.json({ id: session.id });
});

router.get("/", async (req, res) => {
    try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM orders');
    const orders = {
        data: result.rows,
        total: result.rows.length
      };
    client.release();
    return res.send(orders);
    } catch (error) {
    console.error("Error retrieving orders:", error);
    return res.status(500).send("Internal Server Error");
    }
});

router.get("/user/:user_id", async (req, res) => {
    try {
        const client = await pool.connect();
        const userId = req.params.user_id;

        const result = await client.query('SELECT * FROM orders WHERE user_id = $1', [userId]);
        client.release();

        if (result.rows.length === 0) {
            return res.status(404).send("No orders found for this user.");
        }

        return res.json(result.rows);
    } catch (error) {
        console.error("Error retrieving orders for user:", error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/:id", async (req, res) => {
    try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM orders WHERE order_id = $1', [req.params.id]);
    const order = result.rows[0];
    client.release();

    if (!order) {
    return res.status(400).send("Order with given ID is not present");
    }

    return res.send(order);
    } catch (error) {
    console.error("Error retrieving order:", error);
    return res.status(500).send("Internal Server Error");
    }
    });

    router.post("/", async (req, res) => {
        try {
            const client = await pool.connect();
            const { user_id, amount, items } = req.body;
    
            // Insert the order
            const orderResult = await client.query('INSERT INTO orders (user_id, amount) VALUES ($1, $2) RETURNING timestamp_id', [user_id, amount]);
            const orderId = orderResult.rows[0].timestamp_id;
    
            // Insert each item into the order_items table
            for (const item of items) {
                console.log("Timestamp Id is for product ", item.id);
                await client.query('INSERT INTO order_items (orderid, productid, quantity) VALUES ($1, (SELECT timestamp_id FROM products WHERE id=$2), $3);', [orderId, item.id, item.quantity]);
            }
    
            client.release();
    
            return res.status(201).json({ order_id: orderId});
        } catch (error) {
            console.error("Error creating order:", error);
            return res.status(500).send("Internal Server Error");
        }
    });
    

router.put("/:id", async (req, res) => {
    try {
    const client = await pool.connect();
    const { user_id, amount } = req.body;
    await client.query('UPDATE orders SET user_id = $1, amount = $2 WHERE timestamp_id = $3', [user_id, amount, req.params.id]);
    client.release();

    return res.send("Order updated successfully");
    } catch (error) {
    console.error("Error updating order:", error);
    return res.status(500).send("Internal Server Error");
    }
    });

    router.delete("/:id", async (req, res) => {
    try {
    const client = await pool.connect();
    await client.query('DELETE FROM orders WHERE order_id = $1', [req.params.id]);
    client.release();

    return res.send("Order deleted successfully");
    } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).send("Internal Server Error");
    }
});
  
module.exports = router;
  