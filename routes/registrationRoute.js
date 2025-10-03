const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

route.get("/", (req, res) => {
  res.render("registration");
});

route.post("/", async (req, res) => {
  const { fullName, email, dob, password } = req.body;
  const emailExist = await userModel.findOne({ email });
  if (emailExist) {
    res.send("email already exist");
  } else {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const createUser = await userModel.create({
          fullName,
          email,
          dob,
          password: hash,
        });
        let token = jwt.sign(
          { email, userID: createUser._id },
          "DxMdeA@Wa3FjKGXu"
        );
        res.render("login");
      });
    });
  }
});

module.exports = route;

/* production level code from gemini is below

// --- DEPENDENCIES ---
const express = require("express");
const route = express.Router();
// Assuming userModel is your Mongoose model for User
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Using express-validator for robust input checks
const { body, validationResult } = require("express-validator");

// --- CONFIGURATION / SECURITY ---
// CRITICAL: JWT secret MUST come from an environment variable in production.
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_development_only";
const BCRYPT_SALT_ROUNDS = 10;
const TOKEN_EXPIRY = '1d'; // Token expires in 1 day

// --- MIDDLEWARE: VALIDATION RULES ---
const registrationValidationRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required."),
  body("email").isEmail().normalizeEmail().withMessage("Must be a valid email address."),
  body("dob").isISO8601().withMessage("Date of birth must be a valid date."),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long."),
];

// --- GET: RENDER REGISTRATION PAGE (assuming server-side rendering) ---
route.get("/", (req, res) => {
  // In a production API, this would typically return a static JSON response or be handled by the frontend
  res.render("registration", { title: "Register" });
});

// --- POST: REGISTRATION LOGIC ---
route.post("/", registrationValidationRules, async (req, res) => {
  // 1. Check for input validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return 400 Bad Request with detailed validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, dob, password } = req.body;

  try {
    // 2. Check if user already exists (409 Conflict)
    const emailExist = await userModel.findOne({ email });
    if (emailExist) {
      return res.status(409).json({ message: "Email already exists. Please login." });
    }

    // 3. Hash the password using async/await structure
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create the new user in the database
    const newUser = await userModel.create({
      fullName,
      email,
      dob,
      password: hashedPassword,
    });

    // 5. Generate JWT and immediately log the user in (product standard practice)
    const token = jwt.sign(
      { email: newUser.email, userID: newUser._id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // 6. Set the token as a secure HTTP-only cookie and respond
    res.cookie("auth_token", token, {
      httpOnly: true, // Prevents client-side JS from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      sameSite: 'strict', // Security protection against CSRF
    });

    // 7. Successful Registration Response (201 Created)
    // We send a JSON response indicating success and then redirect on the client-side,
    // or simply redirect if this is a server-rendered app.
    // For a mixed API/SSR context, redirecting is usually cleaner post-cookie-set.
    
    // Option A: API Response (recommended for modern development)
    // return res.status(201).json({
    //   message: "Registration successful. User logged in.",
    //   userId: newUser._id
    // });
    
    // Option B: Server-Side Rendered Redirect (based on original code)
    // Note: The cookie must be set BEFORE the redirect header.
    return res.redirect("/login"); 

  } catch (error) {
    console.error("Registration Error:", error);
    // 500 Internal Server Error for unhandled exceptions (DB failure, unexpected errors)
    return res.status(500).json({ message: "An internal server error occurred during registration." });
  }
});

module.exports = route;

*/
