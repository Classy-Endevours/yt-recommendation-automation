const express = require("express");
const { getRecommendation } = require("../service/browser");

const router = express.Router();

router.get("/", async function (req, res, next) {
  res.status(200).send("welcome");
});

router.post("/", async function (req, res, next) {
  const { url, count, cookies, delay } = req.body;
  const recommendation = await getRecommendation(url, count, cookies, delay);
  res.status(200).send(recommendation.slice(0, count));
});

module.exports = router;
