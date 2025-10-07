const express = require("express");
const axios = require("axios");
const Booking = require("../models/Booking");

const router = express.Router();

// JazzCash Payment API
router.post("/jazzcash", async (req, res) => {
  try {
    const { amount, phoneNumber, bookingId } = req.body;

    const response = await axios.post("https://sandbox.jazzcash.com.pk/api/payment", {
      amount,
      mobile: phoneNumber,
    });

    if (response.data.status === "success") {
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "Paid" });
      res.json({ message: "Payment Successful via JazzCash!" });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Payment Error" });
  }
});

// EasyPaisa Payment API
router.post("/easypaisa", async (req, res) => {
  try {
    const { amount, phoneNumber, bookingId } = req.body;

    const response = await axios.post("https://sandbox.easypaisa.com.pk/api/payment", {
      amount,
      mobile: phoneNumber,
    });

    if (response.data.status === "success") {
      await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "Paid" });
      res.json({ message: "Payment Successful via EasyPaisa!" });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    res.status(500).json({ error: "Payment Error" });
  }
});

// Bank Transfer (Manual)
router.post("/bank-transfer", async (req, res) => {
  try {
    const { bookingId } = req.body;

    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "Pending Bank Transfer" });
    res.json({ message: "Bank transfer initiated. Contact support for confirmation." });
  } catch (error) {
    res.status(500).json({ error: "Bank Transfer Error" });
  }
});

module.exports = router;
