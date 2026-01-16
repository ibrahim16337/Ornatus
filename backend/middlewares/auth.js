const jwt = require("jsonwebtoken");
const config = require("config");
const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost', // Or your PostgreSQL host
  database: 'Furniture',
  password: 'lxo8999',
  port: 5432, // Default PostgreSQL port
});

async function auth(req, res, next) {
  let token = req.header("x-auth-token");
  console.log('Token is ',token);
  if (!token) return res.status(400).send("Token Not Provided");

  try {
    const client = await pool.connect();
    const result = await client.query(`SELECT * FROM users WHERE email = $1`, [token]); // Assuming the user ID is stored in the token
    const user = result.rows[0];
    client.release();

    if (!user) return res.status(401).send("Invalid Token");

    req.user = user; // Assuming user information is stored in req.user
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = auth;
