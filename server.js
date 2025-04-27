const express = require('express');
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "sokaswahiba"; // Hakikisha inalingana na ulioweka Meta

app.get("/", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("Webhook Verified!");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.send("SokaSwahiba Webhook is Active!");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
