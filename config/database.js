const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://zettelAdmin:WLrlAzU8jrlBjczn@zetteldb.i6gcnkq.mongodb.net/?retryWrites=true&w=majority&appName=zettelDB"
    );
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1); // exit process with failure
  }
};

module.exports = connectDB;
