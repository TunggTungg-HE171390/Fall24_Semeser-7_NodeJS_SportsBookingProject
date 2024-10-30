const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const httpErrors = require("http-errors");
const bodyParser = require("body-parser");
require("dotenv").config();
const getLocalIP = require("./utils/ipconfig");

const app = express();

const { FieldRouter, PostRouter, UserRouter, AuthenticationRouter, FeedbackRouter, Field_OrderRouter, Equipment_OrderRouter } = require("./routes");

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
app.use("/feedback", FeedbackRouter);
app.use("/field_order", Field_OrderRouter);
app.use("/equipment_order", Equipment_OrderRouter);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
      message: err.message || "An unexpected error occurred.",
      status: err.status || 500
  });
});

app.listen(process.env.PORT,  () => {
  console.log(`Server is running on http://192.168.20.44:${process.env.PORT}`);
  const ip = getLocalIP();
  console.log(`IP Address: ${ip}`);
  db.connectDB();
});
