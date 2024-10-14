const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const bodyParser = require("body-parser");
require("dotenv").config();
const getLocalIP = require("./utils/ipconfig");

const app = express();

const db = require("./models/index");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Hello World" });
});

// get local ip
app.get("/get-ip", (req, res) => {
  const ip = getLocalIP();
  res.status(200).json({ ip });
});

//Routes

app.use("/post", require("./routes/post.route"));
app.use("/user", require("./routes/user.route"));
app.use("/field", require("./routes/field.route"));

app.use(async (req, res, next) => {
  res.status = err.status;
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT, process.env.HOST_NAME, () => {
  console.log(
    `Server running at http://${process.env.HOST_NAME}:${process.env.PORT}`
  );
  const ip = getLocalIP();
  console.log(`IP Address: ${ip}`);
  // Connect DB
  db.connectDB();
});
