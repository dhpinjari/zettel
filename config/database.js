const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb+srv://zettelAdmin:WLrlAzU8jrlBjczn@zetteldb.i6gcnkq.mongodb.net/?retryWrites=true&w=majority&appName=zettelDB"
    )
    .then(function () {
      console.log("connected");
    })
    .catch(function (err) {
      console.log(err);
    });
};
module.exports = mongoose.connection;
