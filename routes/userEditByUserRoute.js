const express = require("express");
const route = express.Router();
const userModel = require("../model/users");

route.get("/:userID", async (req, res, next) => {
  try {
    const userID = req.params.userID;
    const userDetail = await userModel.findOne({ _id: userID });
    res.render("userEditByUser", { userDetail });
  } catch (error) {
    console.error(
      `Error fetching user details for ID ${req.params.userid}:`,
      error
    );
    next(error);
  }
});

route.post("/:userID", async (req, res, next) => {
  const { profilePhoto, fullName, email, dob } = req.body;
  const userID = req.params.userID;
  try {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: userID },
      { profilePhoto, fullName, email, dob },
      { new: true }
    );
    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: `User with ID ${userID} not found for update.` });
    }
    return res.status(200).json({
      message: "Details updated successfully",
    });
  } catch (error) {
    console.error(
      `Error fetching user details for ID ${req.params.userid}:`,
      error
    );
    next(error);
  }
  res.render("userEditByUser");
});

module.exports = route;
