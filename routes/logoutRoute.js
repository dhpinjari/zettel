const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("login");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
