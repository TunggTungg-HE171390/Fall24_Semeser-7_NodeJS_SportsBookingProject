const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

const db = require("./models/index");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", async (req, res, next) => {
  res.status(200).json({ message: "Hello World" });
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

  db.connectDB();
});
