const express = require("express");
const route = express.Router();

route.get("/", (req, res) => {
  res.render("userListForAdmin");
});

module.exports = route;
