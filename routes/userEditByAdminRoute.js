const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { promisify } = require("util");

// Promisify bcrypt.compare to use it with async/await
const compareHash = promisify(bcrypt.compare);

route.get("/:userid", (req, res) => {
  res.render("userEditByAdmin");
});

module.exports = route;
