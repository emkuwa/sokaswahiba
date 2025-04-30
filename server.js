const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Hardcoded verify token (must match Facebook Developer Console)
const VERIFY_TOKEN = "sokaswahiba";

// 🔐 Replace this with your actual Facebook Page Access Token
const PAGE_ACCESS_TOKEN = "EAAiNtAMdupUBO5oZA8Gu3feVAk8FhZBWmhymfHKRiJ9dcOX5mZBYrC4b2XGr5CSWFcfvUfONaZBQfqvmPFZAGQnnOqKwBPLnk412ZA7QY4hoEXCoXQtfQmd53VkYEjsmANsZCTJX0Qr9EubIZADwwGwynOCbKRnPGYRbTycZAM4l0XpblNbKMQlu1gwEvxbyhJRZAZAmD2zucCui0P9nvUZD";

app.use(express.json());

// ✅ Webhook verification endpoint (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log("Webhook GET called with:", { mode, token, challenge });

  if (mode && token && challenge) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      return res.status(200).send(challenge);
    } else {
      console.log("Token mismatch:", token);
      return res.sendStatus(403);
    }
  } else {
    return res.status(400).send('Missing query params');
  }
});

// ✅ Message handling endpoint (POST)
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(function(entry) {
      const webhookEvent = entry.messaging[0];
      console.log('Incoming Message:', webhookEvent);

      const senderPsid = webhookEvent.sender.id;

      if (webhookEvent.message && webhookEvent.message.text) {
        const userMessage = webhookEvent.message.text;
        console.log(`Received message from ${senderPsid}: ${userMessage}`);

        // Send a reply
        callSendAPI(senderPsid, `Umesema: "${userMessage}". Asante kwa ujumbe!`);
      }
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// ✅ Function to send a reply message using Facebook Messenger API
function callSendAPI(senderPsid, responseText) {
  const requestBody = {
    recipient: { id: senderPsid },
    message: { text: responseText }
  };

  axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
    .then(() => {
      console.log('Message sent!');
    })
    .catch(error => {
      console.error('Unable to send message:', error.response ? error.response.data : error.message);
    });
}

// ✅ Start server
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
