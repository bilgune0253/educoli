const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");
const auth = require("../middleware/auth");

// Student
router.post("/", auth, requestController.createRequest);
router.get("/my", auth, requestController.getMyRequests);

// Tutor
router.get("/tutor", auth, requestController.getRequestsForTutor);
router.put("/:id", auth, requestController.updateRequestStatus);

module.exports = router;