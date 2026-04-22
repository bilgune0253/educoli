const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const uploadController = require("../controllers/uploadController");

router.post("/", auth, upload.single("image"), uploadController.uploadImage);

module.exports = router;