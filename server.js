const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const VERIFY_TOKEN = 'sokaswahiba';

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint ya webhook verification (Meta inataka hii wakati wa ku-"Verify and Save")
app.get('/', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
});

// Endpoint ya kupokea messages kutoka WhatsApp
app.post('/', (req, res) => {
  console.log('Received a WhatsApp message:');
  console.log(JSON.stringify(req.body, null, 2));

  const body = req.body;

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].changes[0].value.messages[0]
    ) {
      const message = body.entry[0].changes[0].value.messages[0];
      const text = message.text && message.text.body ? message.text.body.toLowerCase() : '';

      console.log('User Message:', text);

      // Hapa unaweza kuweka logic zako za kuchunguza maneno kama "ratiba", "mechi" nk
      if (text.includes('ratiba')) {
        console.log('User asked for RATIBA');
        // Hapa unaweza kutuma response kwa WhatsApp API kama unataka
      } else if (text.includes('mechi')) {
        console.log('User asked for MECHI');
        // Hapa pia unaweza kutuma response
      } else {
        console.log('Unrecognized command');
      }
    }
  }

  res.sendStatus(200); // Always respond 200 to WhatsApp to avoid retries
});

// Server kusikiliza requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
