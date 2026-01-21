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
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel", //  "userModel" as it is exported from users db
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("noteModel", noteSchema);
