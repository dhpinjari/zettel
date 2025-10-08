const express = require("express");
const route = express.Router();
const userModel = require("../model/users");

route.get("/", async (req, res) => {
  try {
    const showAllUsers = await userModel.find().lean(); // Use .lean() for faster query performance when not modifying the results.
    res.render("userListForAdmin", { showAllUsers });
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
