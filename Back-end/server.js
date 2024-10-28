const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const bodyParser = require("body-parser");
require("dotenv").config();
const getLocalIP = require("./utils/ipconfig");

const app = express();

const {
  FieldRouter,
  PostRouter,
  UserRouter,
  AuthenticationRouter,
  FieldOrderRouter,
} = require("./routes");

const db = require("./models");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// get local ip
app.get("/get-ip", (req, res) => {
  const ip = getLocalIP();
  res.status(200).json({ ip });
});

//Routes
app.use("/post", PostRouter);
app.use("/user", UserRouter);
app.use("/field", FieldRouter);
app.use("/auth", AuthenticationRouter);
app.use("/field-order", FieldOrderRouter);

app.use(async (err, req, res, next) => {
  res.status(err.status || 500).send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://192.168.1.70:${process.env.PORT}`);
  const ip = getLocalIP();
  console.log(`IP Address: ${ip}`);
  db.connectDB();
});
