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
    const userDetail = await userModel.findOne({ _id: userID });

    bcrypt.compare(
      currentPassword,
      userDetail.password,
      async (err, result) => {
        if (err) return res.send("error");
        const salt = await bcrypt.genSalt(config.BCRYPT_SALT_ROUNDS);
        const hash = await bcrypt.hash(newPassword, salt);

        const updatePassword = await userModel.findOneAndUpdate(
          {
            _id: userID,
          },
          { password: hash },
          { new: true }
        );
        res.send("password updated");
      }
    );
  } catch (error) {
    console.error("error:", error);
    res.status(500).send("Server error.");
  }
});
module.exports = route;
