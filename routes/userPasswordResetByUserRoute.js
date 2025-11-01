const express = require("express");
const route = express.Router();
const userModel = require("../model/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const cookieParser = require("cookie-parser");

route.get("/:userID", (req, res) => {
  res.render("userPasswordResetByUser");
});

route.post("/", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const userID = decoded.userID;
    const userDetail = await userModel
      .findOne({ _id: userID })
      .select("+password"); //schema has password set as select: false, you need to explicitly select it:

    bcrypt.compare(
      currentPassword,
      userDetail.password,
      async (err, result) => {
        if (err) {
          // Handle bcrypt comparison error (e.g., bad hash in database)
          console.error("Bcrypt compare error:", err);
          return res.status(500).send("Password comparison failed.");
          // return res.json({
          //   user: userDetail.fullName,
          //   id: userDetail._id,
          // });
        }

        if (!result) {
          // Handle incorrect current password
          return res.status(401).send("Incorrect current password.");
        } else {
          const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
          const hash = await bcrypt.hash(newPassword, salt);

          const updatePassword = await userModel.findOneAndUpdate(
            {
              _id: userID,
            },
            { password: hash },
            { new: true }
          );
          res.send("Password updated");
        }
      }
    );
  } catch (error) {
    console.error("error:", error);
    res.status(500).send("Server error.");
  }
});
module.exports = route;
