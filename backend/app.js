require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { Pool } = require("pg");
var cors = require("cors");

var app = express();
app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// ✅ Reuse Pool across Vercel invocations (prevents too many connections)
const pool =
  global.__pgPool ||
  new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT || 5432),

    // Neon/Vercel SSL: set PG_SSL=true in Vercel env vars
    ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
  });

global.__pgPool = pool;

// ✅ quick health endpoint to test DB on Vercel
app.get("/api/health", async (req, res) => {
  try {
    const r = await pool.query("SELECT NOW() as now");
    return res.json({ ok: true, db: true, now: r.rows[0].now });
  } catch (e) {
    console.error("DB health check failed:", e);
    return res.status(500).json({ ok: false, db: false, error: e.message });
  }
});

// routes
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users");
var productsRouter = require("./routes/api/products");
var categoriesRouter = require("./routes/api/categories");
var reviewRouter = require("./routes/api/reviews");
var orderRouter = require("./routes/api/orders");

app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/category", categoriesRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/orders", orderRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.use((req, res) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
  });

  pool
    .connect()
    .then((client) => {
      console.log("Connected to PostgreSQL");
      client.release();
    })
    .catch((err) => console.error("Error connecting to PostgreSQL database:", err));
}

module.exports = app;
