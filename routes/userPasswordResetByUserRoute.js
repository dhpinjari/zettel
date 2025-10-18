const express = require("express");
const route = express.Router();

route.get("/:userID", (req, res) => {
  res.render("userPasswordResetByUser");
});
module.exports = route;
