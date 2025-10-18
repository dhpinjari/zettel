const express = require("express");
const route = express.Router();

route.get("/", async (req, res, next) => {
  try {
    res.render("userEditByUser");
  } catch (error) {
    console.error(
      `Error fetching user details for ID ${req.params.userid}:`,
      error
    );
    next(error);
  }
});

// route.post("/", async (req, res) => {
// const { profilePhoto, fullName, email, dob, password } = body.req;
//   res.render("userEditByUser");
// });

module.exports = route;
