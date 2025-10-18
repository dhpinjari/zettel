const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { promisify } = require("util");

// Promisify bcrypt.compare to use it with async/await
const compareHash = promisify(bcrypt.compare);

route.get("/", (req, res) => {
  res.render("login");
});

route.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }
  try {
    const user = await userModel.findOne({ email }).select("+password"); // select('+password') since select:false in user db
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    //Compare Passwords using Promisified function (Cleaner async/await)
    const isMatch = await compareHash(password, user.password);

    //Password Match Check
    if (!isMatch) {
      // Security Improvement: Generic error message
      return res.status(401).json({
        message: "Invalid credentials.",
      });
    }

    //  Generate JWT Token
    const token = jwt.sign(
      { email: user.email, userID: user._id },
      config.JWT_SECRET,
      { expiresIn: config.TOKEN_EXPIRY }
    );

    //Set Secure Cookie
    const tokenExpirySeconds = parseInt(config.TOKEN_EXPIRY.slice(0, -1)); // e.g., converts "1h" to 1

    res.cookie("token", token, {
      httpOnly: true, // Crucial: Prevents client-side JavaScript access (XSS defense)

      maxAge: tokenExpirySeconds * 3600 * 1000, // Explicit expiry in milliseconds
      // secure: process.env.NODE_ENV === "production", // Crucial: Only send cookie over HTTPS in production [Porduction setting]
      // sameSite: "strict", // Crucial: CSRF defense [Porduction setting]

      secure: false, // true only if HTTPS is used [false as Local testing]
      sameSite: "lax", // [Local setting]
      path: "/",
    });

    // 8. Successful Response (Do not return sensitive data like the password hash)
    // for api    res.status(200).json({message: "Login successful.", redirect: "/mainNotes"}); // Example: tell the client where to go next
    res.redirect("/mainNotes");
  } catch (error) {
    console.error("Login server error:", error);
    // 9. Robust Server Error Handling
    return res.status(500).json({
      message: "An internal server error occurred during login.",
    });
  }
  //   bcrypt.compare(passowrd, emailExist.passowrd, (err, result) => {
  //     if (err) {
  //       res.status(401).send("Unauthorized.");
  //     }
  //     const token = jwt.sign(
  //       { email, userID: emailExist._id },
  //       config.JWT_SECRET,
  //       { expiresIn: config.TOKEN_EXPIRY }
  //     );
  //     res.cookie("token", token);
  //     res.send("connected");
  //   });
  // } catch (error) {
  //   console.error("Login error:", error);
  //   res.status(500).send("Server error during login.");
  // }
});

module.exports = route;
