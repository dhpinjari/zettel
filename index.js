const express = require("express");
const app = express();
const connectDB = require("./config/database");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const mainNotesRoute = require("./routes/mainNotesRoute");
const userListForAdminRoute = require("./routes/userListForAdminRoute");
const registrationRoute = require("./routes/registrationRoute");
const loginRoute = require("./routes/loginRoute");
const userEditByAdminRoute = require("./routes/userEditByAdminRoute");
const userEditByUserRoute = require("./routes/userEditByUserRoute");
const userPasswordResetByUserRoute = require("./routes/userPasswordResetByUserRoute");
const createNewNoteRoute = require("./routes/createNewNoteRoute");
const updateNoteRoute = require("./routes/updateNote");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
connectDB();
app.use(cookieParser());

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
app.use("/userPasswordResetByUser", userPasswordResetByUserRoute);
app.use("/createNote", createNewNoteRoute);
app.use("/updateNote", updateNoteRoute);

app.listen(process.env.PORT);
