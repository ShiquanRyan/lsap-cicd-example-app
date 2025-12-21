// app.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1>Welcome to the CI/CD Workshop!</h1>");
});

app.get("/health", (req, res) => {
  // res.status(200).send("successful test");
  res.status(200).send("lsap hw6 online demo test");
});

module.exports = app;
