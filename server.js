const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Token yako uliyoandika kwenye Facebook webhook
const VERIFY_TOKEN = "sokaswahiba";

app.use(express.json());

// GET endpoint ya verification
app.get('/', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403); // Forbidden
        }
    } else {
        res.sendStatus(400); // Bad Request
    }
});

// POST endpoint ya kupokea message updates
app.post('/', (req, res) => {
    console.log('Received a webhook POST:', JSON.stringify(req.body, null, 2));
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
