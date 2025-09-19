const express = require("express");
const app = express();

const mainNotesRoute = require("./routes/mainNotesRoute");
const userListForAdminRoute = require("./routes/userListForAdminRoute");
const registrationRoute = require("./routes/registrationRoute");
const loginRoute = require("./routes/loginRoute");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(3000);
