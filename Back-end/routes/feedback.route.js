const express = require("express");
const bodyParser = require("body-parser");

const router = express.Router();
router.use(bodyParser.json());

const { FeedbackController } = require("../controllers");

router.get("/:id", FeedbackController.getFeedbackByCustomerId);
router.post("/create", FeedbackController.createFeedback);
router.get("/get-all", FeedbackController.getAllFeedbacks);
router.put("/update/:id", FeedbackController.updateFeedback);
router.delete("/delete/:id", FeedbackController.deleteFeedback);

module.exports = router;
