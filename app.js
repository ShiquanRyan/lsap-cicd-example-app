// app.js
const express = require("express");
const app = express();

<<<<<<< HEAD
=======

>>>>>>> dev
app.get("/", (req, res) => {
  res
    .status(200)
    .send("<h1>Welcome to the CI/CD Workshop!</h1>");
});

app.get("/health", (req, res) => {
  res.status(200).send("successful test");
});

module.exports = app;
