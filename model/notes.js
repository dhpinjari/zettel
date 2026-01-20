const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a note title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    mainNote: {
      type: String,
      required: [true, "Please add the note content"],
    },
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Ensures relationship to the User model
    //   required: true,
    //   index: true, // Optimizes queries for a specific user's notes
    // },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Note", noteSchema);
