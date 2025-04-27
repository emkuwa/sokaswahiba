const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = "sokaswahiba";
const WHATSAPP_TOKEN = "EAAiNtAMdupUBO37CqPHMSnyLFwfEAwCZAHbLh75tyuOjxVEfAlzy9C2iLXNgipelpfB3xZCDbZABgfEOZCp42lKvZCZBxSLjLWjrGZA1C2vmRlukZB4msuEzxHlyR6thObdDR2avCB4v8fLLFflZA4zuti3PMAy5RfNuh19ofQh5HJQF7HcFGo32MpGUDLLJ5xMqJVWZCl8xog0toZCwwZCs5NtflklpZCOdR6VxuhmQarLBr";

app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified successfully!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.send("SokaSwahiba Bot is running!");
  }
});

app.post("/", async (req, res) => {
  console.log("📥 Received POST:", JSON.stringify(req.body, null, 2));
  const body = req.body;

  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const phoneNumberId = body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = body.entry[0].changes[0].value.messages[0].from;
      const messageText = body.entry[0].changes[0].value.messages[0].text.body.toLowerCase();

      let reply = "👋 Karibu SokaSwahiba! Andika 'ratiba', 'matokeo', au 'mechi' ili kupata taarifa.";

      if (messageText.includes("ratiba")) {
        reply = "📅 Ratiba ya leo: Simba vs Yanga saa 1:00 jioni, Mkapa Stadium.";
      } else if (messageText.includes("matokeo")) {
        reply = "🏆 Matokeo ya jana: Azam FC 2 - 1 Mtibwa Sugar.";
      } else if (messageText.includes("mechi")) {
        reply = "🔍 Utabiri wa mechi: Yanga 55% - Simba 45%.";
      } else if (messageText.includes("habari")) {
        reply = "⚽ Habari! Karibu tena kwenye SokaSwahiba!";
      }

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
        headers: {
          "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        },
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: reply }
        }
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 SokaSwahiba Bot is running on port ${PORT}`);
});