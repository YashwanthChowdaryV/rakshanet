const express = require("express");

const router = express.Router();

const nlpController = require(
    "../controllers/nlpController"
);


router.post(
    "/analyze",
    nlpController.analyzeMultipleTexts
);


module.exports = router;