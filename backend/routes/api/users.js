const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Furniture',
  password: 'lxo8999',
  port: 5432,
});

// Define routes
router.post("/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, email, password } = req.body;

    // Check if user with given email already exists
    const existingUser = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).send("User with given Email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await client.query('INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword, "user"]);

    //Generate JWT token
    const token = jwt.sign({ name, email }, config.get("jwtPrivateKey"));

    // Return response
    res.send({ name, email,token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
});

router.post("/login", async (req, res) => {
  const client = await pool.connect();
  try {
    const { email, password } = req.body;

    // Retrieve user from the database
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    console.log("User fetched from database successfully", user);
    if (!user) {
      return res.status(400).send("User Not Registered");
    }

    // Validate password
    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log("Password from the database", user.password);
    if (!isValidPassword) {
      return res.status(401).send("Invalid Password");
    }

    // Generate JWT token
    const tokenPayload = {
      _id: user._id,
      username: user.username,
      role: user.role,
      email: user.email,
      id: user.timestamp_id
    };
    const token = jwt.sign(tokenPayload, config.get("jwtPrivateKey"));
    console.log("Generated token is ", token);
    // Return token
    res.send({
        token: token,
        role: user.role
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
});

module.exports = router;
