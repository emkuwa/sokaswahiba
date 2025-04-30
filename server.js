const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VERIFY_TOKEN = "sokaswahiba";

app.use(express.json());

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

app.post('/webhook', (req, res) => {
  console.log('Webhook event received:', JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
