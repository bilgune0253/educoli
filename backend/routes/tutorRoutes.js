const express = require("express");
const router = express.Router();

const tutorController = require("../controllers/tutorController");

router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getTutorProfile);

module.exports = router;