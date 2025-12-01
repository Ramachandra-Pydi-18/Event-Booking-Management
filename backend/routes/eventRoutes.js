const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/auth");

router.route("/").get(getEvents).post(protect, authorize("admin"), createEvent);
router
  .route("/:id")
  .get(getEvent)
  .put(protect, authorize("admin"), updateEvent)
  .delete(protect, authorize("admin"), deleteEvent);

module.exports = router;

