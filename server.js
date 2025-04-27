const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const VERIFY_TOKEN = "sokaswahiba";

app.use(express.json());

// Endpoint ya GET kwa webhook verification
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

// Endpoint ya POST kupokea WhatsApp messages
app.post('/', (req, res) => {
    console.log('Webhook event received:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
