const express = require("express");
const route = express.Router();
const notesModel = require("../model/notes");
route.post("/:singleNoteId", async (req, res) => {
  try {
    const singleNote = req.params.singleNoteId;
    await notesModel.findOneAndDelete({ _id: singleNote });
    res.redirect("/mainNotes");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = route;
