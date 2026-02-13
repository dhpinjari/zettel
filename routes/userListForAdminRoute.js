const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const notes = require("../model/notes");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

route.get("/", async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  // AdminUser is not available so it is redirecting to lOGIN page
  try {
    // const decode = jwt.verify(token, config.JWT_SECRET);
    // const adminId = decode.id || decode.userid || decode._id;

    const [showAllUsers, totalUser, totalNotes] = await Promise.all([
      userModel.find().lean(), // Use .lean() for faster query performance when not modifying the results.
      // userModel.findById(adminId),
      userModel.countDocuments(),
      notes.countDocuments(),
    ]);
    // if (!adminUser) {
    //   return res.redirect("/login");
    // }
    res.render("userListForAdmin", {
      showAllUsers,
      // adminUser,
      totalUser,
      totalNotes,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);

    // Pass the error to the global Express error-handling middleware.
    // This prevents the server from crashing and allows a single place to handle 500 errors.
    next(error);

    // If you don't use a global error handler, you would send a generic 500 response here:
    // res.status(500).render("error", { message: "Internal Server Error" });
  }
});

module.exports = route;
