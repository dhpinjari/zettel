const express = require("express");
const route = express.Router();
const userModel = require("../model/users");

route.get("/", async (req, res) => {
  const showAllUsers = await userModel.find();
  res.render("userListForAdmin", { showAllUsers });
});

module.exports = route;
