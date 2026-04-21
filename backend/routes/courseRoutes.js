const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// зөвхөн tutor course үүсгэнэ
router.post("/", auth, role("tutor"), courseController.createCourse);

// бүх хүн course list харж болно
router.get("/", courseController.getCourses);

// бүх хүн нэг course харж болно
router.get("/:id", courseController.getCourseById);

// зөвхөн tutor course устгана
router.delete("/:id", auth, role("tutor"), courseController.deleteCourse);

module.exports = router;