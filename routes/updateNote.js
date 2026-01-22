const express = require("express");
const route = express.Router();
const noteModel = require("../model/notes");

route.post("/:noteID", async (req, res) => {
  const { title, mainnote } = req.body;
  const noteID = req.params.noteID;

  try {
    await noteModel.findOneAndUpdate(
      { _id: noteID },
      { title: title, mainNote: mainnote },
      { new: true },
    );

    res.redirect("/mainNotes");
  } catch (error) {
    console.error(err);
    res.status(500).send("Internal Server Error: Could not update the note.");
  }
});
module.exports = route;
