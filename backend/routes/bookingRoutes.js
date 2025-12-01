const express = require("express");
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBooking,
  updatePaymentStatus,
  sendReminder,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getUserBookings)
  .post(protect, createBooking);

router.route("/all").get(protect, authorize("admin"), getAllBookings);

router.route("/:id").get(protect, getBooking);
router.route("/:id/payment").put(protect, updatePaymentStatus);
router.route("/:id/reminder").post(protect, sendReminder);

module.exports = router;

