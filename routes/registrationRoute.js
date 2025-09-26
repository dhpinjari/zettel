const express = require("express");
const route = express.Router();
const userModel = require("../model/users");

route.get("/", (req, res) => {
  res.render("registration");
});

route.post("/", async (req, res) => {
  const { fullName, email, dob, password } = req.body;
  const createUser = await userModel.create({ fullName, email, dob, password });
  res.render("login");
});

module.exports = route;
