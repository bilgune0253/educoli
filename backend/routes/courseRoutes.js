const express = require("express");
const router = express.Router();

const courseController = require("../controllers/courseController");
const auth = require("../middleware/auth");

router.post("/", auth, courseController.createCourse);

router.get("/", courseController.getCourses);

router.get("/:id", courseController.getCourseById);

router.delete("/:id", auth, courseController.deleteCourse);

module.exports = router;