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

module.exports = router;