const express = require("express");
const route = express.Router();
const noteModel = require("../model/notes");

route.post("/", async (req, res) => {
  const { title, mainnote } = req.body;
  await noteModel.create({
    title,
    mainNote: mainnote,
  });
  res.redirect("/mainNotes");
});

module.exports = route;
