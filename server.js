const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Replace with your actual WhatsApp Cloud API token
const WHATSAPP_TOKEN = "EAAiNtAMdupUBO1CBKGv4uDcSgJZBmTyzvnyqoRdg9EQXQbj07GdmUt78kDX8eCG2mLPMZA55fPN5Tduj6MeIZALKSAKCsvpgE4bauZA64UPfh8ZCXmrbdZAccFXpN7trkDXxN9iAEHDIcUgLqreCJudqQLZCwBqyHUrOFqslmBX1BP9dAvfgmgNBDBUTyZCJgEnTORvGREqZB9nEU174xjEZAGURICHAeN8qTCDK1mr3K6MQZDZD";

// ✅ Replace with your phone number ID from dashboard
const PHONE_NUMBER_ID = "637244432803866";

app.use(express.json());

// ✅ Webhook verification (required by Meta)
app.get('/webhook', (req, res) => {
  const verify_token = "sokaswahiba";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// ✅ Handle incoming WhatsApp messages
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object) {
    body.entry?.forEach(async (entry) => {
      const changes = entry.changes?.[0];
      const messages = changes?.value?.messages;

      if (messages && messages[0]) {
        const from = messages[0].from;
        const text = messages[0].text?.body || "No message body";

        console.log(`📩 New message from ${from}: ${text}`);

        // Send auto-reply
        await axios.post(
          `https://graph.facebook.com/v17.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            text: { body: `Umesema: "${text}". Karibu Zanzibaba Building Materials.` }
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json"
            }
          }
        );
      }
    });

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`✅ WhatsApp bot is live on port ${PORT}`);
});
