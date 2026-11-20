
const router = require("express").Router();

const controller = require("../controllers/learningController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

router.get("/", controller.list);
router.get(
    "/my",
    auth,
    role("student"),
    controller.getMyLearningRequests
);
router.get("/:id", controller.detail);

router.post(
    "/",
    auth,
    role("student"),
    controller.create
);

router.post(
    "/:id/offers",
    auth,
    role("tutor"),
    controller.offer
);

router.patch(
    "/:id/offers/:offerId/accept",
    auth,
    role("student"),
    controller.accept
);

router.patch(
    "/:id/close",
    auth,
    role("student"),
    controller.close
);

router.patch(
  "/:id/request-completion",
  auth,
  role("tutor"),
  controller.requestCompletion
);

router.patch(
  "/:id/confirm-completion",
  auth,
  role("student"),
  controller.confirmCompletion
);

router.patch(
  "/:id/dispute-completion",
  auth,
  role("student"),
  controller.disputeCompletion
);

module.exports = router;
