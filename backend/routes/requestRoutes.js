const express = require("express");
const router = express.Router();

const requestController = require("../controllers/requestController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// зөвхөн student request илгээнэ
router.post("/", auth, role("student"), requestController.createRequest);

// зөвхөн student өөрийн request-үүдээ харна
router.get("/my", auth, role("student"), requestController.getMyRequests);

// зөвхөн tutor өөр дээрээ ирсэн request-үүдийг харна
router.get("/tutor", auth, role("tutor"), requestController.getRequestsForTutor);

// зөвхөн tutor request approve/reject хийнэ
router.put("/:id", auth, role("tutor"), requestController.updateRequestStatus);

module.exports = router;