const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Using express-validator for robust input checks
const { body, validationResult } = require("express-validator"); //check this and to install 'npm install express-validator'
const config = require("../config/config"); ////  1. IMPORT YOUR CONFIGURATION FILE

route.get("/", (req, res) => {
  res.render("registration");
});

route.post("/", async (req, res) => {
  const { fullName, email, dob, password, confirmPassword } = req.body;
  // let today = new Date();
  // let minAge = new Date(
  //   today.getFullYear() - 18,
  //   today.getMonth(),
  //   today.getDate()
  // );

  // 1. Input Validation (Good place for express-validator checks)
  // ...

  const emailExist = await userModel.findOne({ email });

  if (emailExist) {
    return res.status(409).json({ message: "Email already exists" }); // Use return to stop execution
  }

  if (password !== confirmPassword) {
    return res.json({
      message: "Password does not match",
      success: false,
      status: 400, // Optional: Include a status code indicating a client error
    });
  }
  // if (dob < minAge) {
  //   return res.json({
  //     message: "User must be at least 18 years old",
  //     success: false,
  //     status: 400, // Optional: Include a status code indicating a client error
  //   });
  // }
  try {
    // Use promise-based bcrypt functions (more readable) // Hash password with salt rounds from config
    const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);

    // Create new user document
    const createUser = await userModel.create({
      fullName,
      email,
      dob,
      password: hash,
    });

    // Generate JWT using configured secret and expiry
    const token = jwt.sign(
      { email, userID: createUser._id },
      config.JWT_SECRET,
      { expiresIn: config.TOKEN_EXPIRY }
    );

    // Optionally, set token cookie (uncomment if needed)
    // res.cookie("token", token, { httpOnly: true, maxAge: config.TOKEN_EXPIRY_IN_MS });
    // return res.status(201).json({ message: "Registration successful" });

    // Keeping your original render for now
    res.render("login");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("Server error during registration.");
  }
});
module.exports = route;
