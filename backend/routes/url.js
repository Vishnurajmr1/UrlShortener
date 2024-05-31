const express = require("express");
const router = express.Router();
const {
  handleGenerateNewShortURL,
  getShortUrl,
  handleGetAnalytics,
} = require("../controllers/url");

router.post("/", handleGenerateNewShortURL);
router.get("/:shortId", getShortUrl);
router.get("/analytics/:shorId", handleGetAnalytics);

module.exports = router;
