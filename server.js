const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("Server is live and working ✅");
});

// ✅ Connect to MongoDB first, then start server
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // Register routes only after DB is connected
    app.use("/api", userRoutes);
    app.use("/api/bookings", bookingRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
