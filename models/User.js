const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // Encrypted password
  role: { type: String, default: "user" }, // "admin" or "user"
});

module.exports = mongoose.model("User", UserSchema);
