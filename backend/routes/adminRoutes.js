const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/users", auth, role("admin"), adminController.getAllUsers);
router.get("/courses", auth, role("admin"), adminController.getAllCourses);

router.delete("/users/:id", auth, role("admin"), adminController.deleteUser);
router.delete("/courses/:id", auth, role("admin"), adminController.deleteCourse);
router.put("/users/:id/role", auth, role("admin"), adminController.updateUserRole);

router.get(
  "/learning-requests",
  auth,
  role("admin"),
  adminController.getAllLearningRequests
);

router.patch(
  "/learning-requests/:id/close",
  auth,
  role("admin"),
  adminController.closeLearningRequest
);

router.delete(
  "/learning-requests/:id",
  auth,
  role("admin"),
  adminController.deleteLearningRequest
);

module.exports = router;