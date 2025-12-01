const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Event = require("../models/Event");

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate("event")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user._id.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    if (booking.paymentStatus === "completed") {
      return res.status(400).json({ success: false, message: "Already paid" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: "usd",
      metadata: {
        bookingId: booking._id.toString(),
        userId: req.user.id,
        eventId: booking.event._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Create intent error: ", error);
    return res.status(500).json({ success: false, message: "Payment failed" });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ success: false, message: "Not completed" });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    booking.paymentStatus = "completed";
    booking.paymentIntentId = paymentIntentId;
    await booking.save();

    const event = await Event.findById(booking.event);
    event.availableTickets -= booking.tickets;
    await event.save();

    res.status(200).json({ success: true, message: "Payment success", data: booking });
  } catch (error) {
    console.error("Confirm error:", error);
    return res.status(500).json({ success: false, message: "Payment error" });
  }
};

// Webhook
exports.webhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  res.json({ received: true });
};
