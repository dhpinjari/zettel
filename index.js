const express = require("express");
const app = express();
const connectDB = require("./config/database");
require("dotenv").config();

const mainNotesRoute = require("./routes/mainNotesRoute");
const userListForAdminRoute = require("./routes/userListForAdminRoute");
const registrationRoute = require("./routes/registrationRoute");
const loginRoute = require("./routes/loginRoute");
const userEditByAdminRoute = require("./routes/userEditByAdminRoute");
const userEditByUserRoute = require("./routes/userEditByUserRoute");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
connectDB();

app.get("/", (req, res) => {
  res.render("zettel");
});

app.get("/registration", (req, res) => {
  res.render("registration");
});

app.use("/mainNotes", mainNotesRoute);
app.use("/login", loginRoute);
app.use("/registration", registrationRoute);
app.use("/userListForAdmin", userListForAdminRoute);
app.use("/userEditByAdmin", userEditByAdminRoute);
app.use("/userEditByAdmin/userPasswordResetByAdmin", userEditByAdminRoute);
app.use("/userEditByUser", userEditByUserRoute);

app.listen(process.env.PORT);
