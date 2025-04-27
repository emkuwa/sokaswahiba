const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("Webhook verified successfully!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Webhook message handler
app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
      let message = body.entry[0].changes[0].value.messages[0];
      let from = message.from;
      let userMessage = message.text.body.toLowerCase();

      let reply;
      if (userMessage.includes("ratiba")) {
        reply = "Ratiba ya leo: Yanga vs Simba saa 1:00 jioni (Uwanja wa Mkapa)";
      } else if (userMessage.includes("matokeo")) {
        reply = "Matokeo ya jana: Azam FC 2 - 1 Namungo FC";
      } else if (userMessage.includes("uchambuzi")) {
        reply = "Uchambuzi: Yanga wanatarajiwa kushambulia zaidi kupitia winga wa kulia.";
      } else if (userMessage.includes("odds")) {
        reply = "Odds: Yanga kushinda @1.80, Simba kushinda @2.10, Sare @3.00.";
      } else if (userMessage.includes("habari")) {
        reply = "Habari: Samatta amerudi kikosini kujiandaa na mechi dhidi ya Azam FC.";
      } else {
        reply = "Karibu SokaSwahiba! Tuma 'ratiba', 'matokeo', 'uchambuzi', 'odds', au 'habari'.";
      }

      sendWhatsAppMessage(from, reply);
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const axios = require("axios");

async function sendWhatsAppMessage(to, message) {
  const url = `https://graph.facebook.com/v17.0/${process.env.PHONE_NUMBER_ID}/messages`;
  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: to,
      text: { body: message },
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      },
    }
  ).catch((error) => console.error("Send message error:", error.response.data));
}

app.listen(PORT, () => {
  console.log("SokaSwahiba Bot is running on port " + PORT);
});