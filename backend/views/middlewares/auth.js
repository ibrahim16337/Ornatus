const jwt = require("jsonwebtoken");
const config = require("config");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),
  // Neon/Vercel SSL fix: set PG_SSL=true in Vercel env vars
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

async function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(400).send("Token Not Provided");

  try {
    let emailToLookup = null;

    // ✅ Prefer JWT (token like: header.payload.signature)
    if (token.split(".").length === 3) {
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      // your login payload includes email, so use it
      emailToLookup = decoded.email;
    } else {
      // ✅ Backward-compatible fallback:
      // your old code treated token as an email directly
      emailToLookup = token;
    }

    if (!emailToLookup) return res.status(401).send("Invalid Token");

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      emailToLookup,
    ]);

    const user = result.rows[0];
    if (!user) return res.status(401).send("Invalid Token");

    req.user = user;
    return next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res.status(401).send("Invalid Token");
  }
}

module.exports = auth;
