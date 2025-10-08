const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { promisify } = require("util");

// Promisify bcrypt.compare to use it with async/await
const compareHash = promisify(bcrypt.compare);

route.get("/:userid", async (req, res, next) => {
  try {
    const EditUserDetails = await userModel.findOne({ _id: req.params.userid });
    if (!EditUserDetails) {
      const error = new Error("User not found.");
      error.status = 404;
      return next(error);
    }
    res.render("userEditByAdmin", { EditUserDetails });
  } catch (error) {
    console.error(
      `Error fetching user details for ID ${req.params.userid}:`,
      error
    );
    next(error);
  }
});

route.post("/:userid", async (req, res, next) => {
  try {
    const { fullName, email, dob, role } = req.body;
    if (!fullName || !email || !dob || !role) {
      // Send a 400 Bad Request response for missing fields
      return res.status(400).json({
        error:
          "All required fields (fullName, email, dob, role) must be provided.",
      });
    }

    // 1. Check for an email conflict:
    // Find a user with the submitted 'email' whose '_id' is NOT the 'userId' from the URL
    const emailExist = await userModel.findOne({
      email,
      _id: { $ne: req.params.userid }, // $ne is the MongoDB operator for "not equal"
    });

    if (emailExist) {
      // If a different user has this email, block the update.
      return res.status(401).json({
        error:
          "Email already exists for another user. Please choose a different one.",
      });
    } else {
      const updateUser = await userModel.findOneAndUpdate(
        { _id: req.params.userid },
        {
          fullName,
          email,
          dob,
          role,
        },
        {
          new: true, // Return the updated document
          runValidators: true, // Enforce Mongoose schema validation rules
        }
      );
      if (!updateUser) {
        // Handle case where user ID is valid but no user was found
        return res.status(404).json({ error: "User not found for update." });
      }
      res.redirect("/userListForAdmin");
    }
  } catch (error) {
    // Check for Mongoose Validation Errors (e.g., email format, role enum)
    if (error.name === "ValidationError") {
      // 400 Bad Request for validation failures
      return res
        .status(400)
        .json({ error: error.message, details: error.errors });
    }

    // Log the detailed error and pass it to the Express error handler middleware
    console.error(
      `Error updating user details for ID ${req.params.userid}:`,
      error
    );
    next(error);
  }
});

route.get("/userPasswordResetByAdmin/:userid", (req, res) => {
  res.render("userPasswordResetByAdmin");
});

module.exports = route;
