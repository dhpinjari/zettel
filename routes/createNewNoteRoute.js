const express = require("express");
const route = express.Router();
const noteModel = require("../model/notes");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

route.post("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(401)
      .render("login", { error: "Access denied. Please log in." });
  }
  try {
    const decode = jwt.verify(token, config.JWT_SECRET);
    const userid = decode.userID;

    const { title, mainnote } = req.body;
    await noteModel.create({
      title,
      mainNote: mainnote,
      userid: userid,
    });
    res.redirect("/mainNotes");
  } catch (error) {
    console.error("Note Creation Error:", error);

    res.status(500).send(error);
  }
});

module.exports = route;
