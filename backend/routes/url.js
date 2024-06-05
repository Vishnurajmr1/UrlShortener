const express = require("express");
const router = express.Router();
const {
  handleGenerateNewShortURL,
  getShortUrl,
  handleGetAnalytics,
  deleteShortUrl,
} = require("../controllers/url");

router.post("/", handleGenerateNewShortURL);
router.get("/:shortId", getShortUrl);
router.get("/analytics/:shortId", handleGetAnalytics);
router.delete("/:shortId", deleteShortUrl);

module.exports = router;
