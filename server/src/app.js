const express = require("express");
const cors = require("cors");
const dns = require("dns");

const app = express();
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Watch Party API Running",
  });
});

module.exports = app;
