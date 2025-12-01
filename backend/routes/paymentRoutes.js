const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  confirmPayment,
  webhook,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhook
);

module.exports = router;

