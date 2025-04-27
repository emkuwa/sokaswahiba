// server.js

const express = require('express');
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Your verify token (should match the one you provide on Meta)
const VERIFY_TOKEN = "sokaswahiba";

// Endpoint to verify webhook
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified successfully!');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.send('SokaSwahiba Bot Webhook Active!');
    }
});

// Endpoint to handle incoming messages
app.post('/', (req, res) => {
    console.log('Received POST:');
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body;

    if (body.object) {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages) {
            const messages = body.entry[0].changes[0].value.messages;
            const from = messages[0].from;
            const text = messages[0].text.body;

            console.log(`New message from ${from}: ${text}`);

            // Here you can add logic to reply to messages
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

// Start server with dynamic port (important for Railway)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
