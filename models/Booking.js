const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  game: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  paymentDetails: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Store user ID
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
