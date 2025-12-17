// app.js
const express = require("express");
const app = express();

x = 5;

app.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1>Welcome to the CI/CD Workshop!</h1>");
});

module.exports = app;
