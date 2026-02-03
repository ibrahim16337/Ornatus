const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
  // Neon/Vercel SSL fix (set PG_SSL=true in Vercel env vars)
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// -------------------------
// POST /api/users/register
// -------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).send("name, email, password are required");
    }

    // Check if user with given email already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send("User with given Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, "user"]
    );

    // Generate JWT token
    const token = jwt.sign({ name, email }, config.get("jwtPrivateKey"));

    // Return response
    return res.send({ name, email, token });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

// -------------------------
// POST /api/users/login
// -------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).send("email and password are required");
    }

    // Retrieve user from the database
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).send("User Not Registered");
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send("Invalid Password");
    }

    // Generate JWT token
    const tokenPayload = {
      _id: user._id, // keep as-is (even if undefined)
      username: user.username,
      role: user.role,
      email: user.email,
      id: user.timestamp_id,
    };

    const token = jwt.sign(tokenPayload, config.get("jwtPrivateKey"));

    return res.send({
      token: token,
      role: user.role,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
