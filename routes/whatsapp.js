const express = require("express");
const twilio = require("twilio");

const router = express.Router();

const accountSid = "your_twilio_account_sid";
const authToken = "your_twilio_auth_token";
const client = twilio(accountSid, authToken);

router.post("/send", async (req, res) => {
  const { phoneNumber, message } = req.body;

  try {
    await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${phoneNumber}`,
      body: message,
    });

    res.json({ message: "WhatsApp notification sent!" });
  } catch (error) {
    res.status(500).json({ error: "WhatsApp Notification Failed" });
  }
});

module.exports = router;
