const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../model/users");

route.get("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .render("login", { error: "Access denied. Please log in." });
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userID = decoded.userID;
    const userDetail = await userModel.findOne({ _id: userID });

    console.log(userDetail);
    res.render("zettel", { userDetail });
  } catch (error) {
    console.error("Error accessing zettel route:", error);
    return res
      .status(500)
      .render("error", { message: "A server error occurred." });
  }
});

module.exports = route;
