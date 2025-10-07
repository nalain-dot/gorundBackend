const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User")
const bcrypt = require("bcryptjs")

const router = express.Router();

// Define available time slots
const timeSlots = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM"
];

// Define available games
const games = [
  "Cricket", "Hockey", "Table Tennis", "Football", "Squash", "Volleyball"
];

// Define payment methods
const paymentMethods = [
  "Bank Card", "JazzCash", "EasyPaisa"
];

// ✅ Get Available Time Slots for a Selected Date
router.get("/available-slots/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const approvedBookings = await Booking.find({
      date: formattedDate,
      status: "approved"
    });

    const bookedSlots = approvedBookings.map(b => b.timeSlot);
    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({ availableSlots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get All Bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Available Booking Dates
router.get("/dates", async (req, res) => {
  try {
    const dates = await Booking.distinct("date");
    res.json({ dates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Time Slots and Available Games
router.get("/time-slots-and-games", (req, res) => {
  try {
    res.json({ timeSlots, games });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Create Booking (Check for Time Availability Before Saving)
router.post("/", async (req, res) => {
  try {
    const { name, cnic, email, phoneNumber, date, timeSlot, game, paymentMethod, paymentDetails, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Register new user with default role "user"
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ name, email, password: hashedPassword });
      await user.save();
    }

    // Create booking with userId
    const newBooking = new Booking({
      name,
      cnic,
      email,
      phoneNumber,
      date,
      timeSlot,
      game,
      paymentMethod,
      paymentDetails,
      status: "pending",
      userId: user._id, // Store the unique user ID
    });

    await newBooking.save();

    res.json({ message: "Booking request submitted! User registered & logged in automatically.", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// ✅ Approve Booking (Only Admin)
router.patch("/:id/approve", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    booking.status = "approved";
    await booking.save();

    res.json({ message: `Booking for ${booking.timeSlot} on ${booking.date} is now approved!` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Reject Booking (Only Admin)
router.patch("/:id/reject", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "rejected" });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }
    res.json({ message: "Booking rejected!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Edit Booking (Only Pending)
router.patch("/:id/edit", async (req, res) => {
  try {
    const { name, cnic, email, phoneNumber, date, timeSlot, game, paymentMethod, paymentDetails } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Booking cannot be edited after approval!" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0];

    const existingBooking = await Booking.findOne({ date: formattedDate, timeSlot, status: "approved" });
    if (existingBooking) {
      return res.status(400).json({ message: "Selected time slot is already booked!" });
    }

    booking.name = name;
    booking.cnic = cnic;
    booking.email = email;
    booking.phoneNumber = phoneNumber;
    booking.date = formattedDate;
    booking.timeSlot = timeSlot;
    booking.game = game;
    booking.paymentMethod = paymentMethod;
    booking.paymentDetails = paymentDetails;

    await booking.save();
    res.json({ message: "Booking updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get Bookings by User ID
router.get("/user/:_id", async (req, res) => {
  try {
    const { _id } = req.params;

    // Find bookings associated with the given user ID
    const bookings = await Booking.find({ userId: _id });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this user!" });
    }

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Delete Booking (Only if Pending)
router.delete("/:id/delete", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }
    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Your Booking is Approved" });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
