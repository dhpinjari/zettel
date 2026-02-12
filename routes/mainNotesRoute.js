const express = require("express");
const route = express.Router();
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const userModel = require("../model/users");
const noteModel = require("../model/notes");

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
    const [userDetail, userNotes] = await Promise.all([
      userModel.findById({ _id: userID }),
      noteModel.find({ userid: userID }),
    ]);

    // await userModel.findOne({ _id: userID });

    res.render("zettel", { userDetail, userNotes });
  } catch (error) {
    console.error("Error accessing zettel route:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = route;
