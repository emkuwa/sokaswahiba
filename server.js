const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const VERIFY_TOKEN = "sokaswahiba";
const ACCESS_TOKEN = "WEKA_HAPA_ACCESS_TOKEN_YAKO";

app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK VERIFIED");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post("/", async (req, res) => {
  console.log("Received:", JSON.stringify(req.body, null, 2));

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      const phone_number_id = req.body.entry[0].changes[0].value.metadata.phone_number_id;
      const from = req.body.entry[0].changes[0].value.messages[0].from;
      const msg_body = req.body.entry[0].changes[0].value.messages[0].text.body.toLowerCase();

      let reply = "";

      if (msg_body.includes("ratiba")) {
        reply = "Ratiba ya leo: Simba SC vs Yanga SC saa 11:00 jioni.";
      } else if (msg_body.includes("mechi")) {
        reply = "Mechi ijayo: Azam FC vs Mtibwa Sugar.";
      } else {
        reply = "Samahani, sijaelewa. Tafadhali andika 'ratiba' au 'mechi'.";
      }

      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
        headers: {
          "Authorization": `Bearer ${ACCESS_TOKEN}`,
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
  console.log(`Server is running on port ${PORT}`);
});