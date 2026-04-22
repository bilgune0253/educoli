const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const verificationController = require("../controllers/verificationController");

router.post("/send", auth, verificationController.sendVerificationEmail);
router.post("/confirm", verificationController.verifyEmail);

module.exports = router;