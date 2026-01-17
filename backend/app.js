require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { Pool } = require("pg");
var config = require("config");
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

// ✅ Postgres pool (supports Neon/Vercel SSL via PG_SSL=true)
var pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT || 5432),

  // If PG_SSL is "true", enable SSL (Neon requires this in production)
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Your routes setup goes here
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

// fallback 404
app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

const PORT = process.env.PORT || 4000;

// Only listen when running locally (node app.js)
// On Vercel, app.js is imported as a serverless function, so do NOT listen.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server Started on port ${PORT}`);
  });

  // Optional: quick connection check when running locally
  pool.connect((err, client, release) => {
    if (err) {
      console.error("Error connecting to PostgreSQL database:", err);
    } else {
      console.log("Connected to PostgreSQL");
      release();
    }
  });
}

module.exports = app;
