const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// зөвхөн student review өгнө
router.post("/", auth, role("student"), reviewController.createReview);

// бүх хүн tutor-ийн review-уудыг харж болно
router.get("/:tutor_id", reviewController.getTutorReviews);

module.exports = router;