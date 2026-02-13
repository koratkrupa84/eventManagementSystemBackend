const express = require("express");
const router = express.Router();
const controller = require("../controllers/privateEventController");

router.post("/", controller.createPrivateEventRequest);

module.exports = router;
