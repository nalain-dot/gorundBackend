const express = require('express');
const Booking = require('../models/Booking');
const router = express.Router();

// Get All Bookings
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
});

// Update Payment Status
router.post('/update-payment', async (req, res) => {
  const { bookingId, paymentStatus } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(bookingId, { paymentStatus });
    res.json({ message: 'Payment status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating payment status' });
  }
});

// Delete Booking
router.delete('/delete-booking/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
});

module.exports = router;
