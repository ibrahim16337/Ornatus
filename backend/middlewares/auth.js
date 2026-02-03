const jwt = require("jsonwebtoken");
const config = require("config");
const { Pool } = require("pg");

// Neon/Vercel: enforce SSL (required for Neon). PG_SSL should be "true" on Vercel.
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token Not Provided");

  try {
    // 1) Verify JWT
    const secret =
      process.env.JWT_SECRET ||
      (typeof config.get === "function" ? config.get("jwtPrivateKey") : null);

    if (!secret) {
      return res
        .status(500)
        .send("JWT secret is missing (set JWT_SECRET or config jwtPrivateKey).");
    }

    const decoded = jwt.verify(token, secret);

    // Your token payload might store user id as: decoded.id OR decoded._id OR decoded.user_id
    const userId = decoded.id || decoded._id || decoded.user_id;

    // If your project stores email inside token instead, keep this fallback:
    const email = decoded.email;

    const client = await pool.connect();

    let result;
    if (userId) {
      // Most common: token has user id
      result = await client.query("SELECT * FROM users WHERE id = $1", [userId]);
    } else if (email) {
      // Fallback: token has email
      result = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    } else {
      client.release();
      return res.status(401).send("Invalid Token payload");
    }

    const user = result.rows[0];
    client.release();

    if (!user) return res.status(401).send("Invalid Token");

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(401).send("Invalid Token");
  }
}

module.exports = auth;
