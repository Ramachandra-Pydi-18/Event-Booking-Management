const Booking = require("../models/Booking");
const Event = require("../models/Event");
const nodemailer = require("nodemailer");

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { eventId, tickets } = req.body;

    if (!eventId || !tickets) {
      return res.status(400).json({
        success: false,
        message: "Please provide event ID and number of tickets",
      });
    }

    // Get event
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if event is active
    if (event.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Event is not available for booking",
      });
    }

    // Check availability
    if (event.availableTickets < tickets) {
      return res.status(400).json({
        success: false,
        message: `Only ${event.availableTickets} tickets available`,
      });
    }

    // Calculate total amount
    const totalAmount = event.price * tickets;

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      tickets,
      totalAmount,
      paymentStatus: "pending",
    });

    // Populate event details
    await booking.populate("event");
    await booking.populate("user", "name email");

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Make sure user owns the booking or is admin
    if (
      booking.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus, paymentIntentId } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update payment status
    booking.paymentStatus = paymentStatus || booking.paymentStatus;
    if (paymentIntentId) {
      booking.paymentIntentId = paymentIntentId;
    }

    // If payment is completed, update event availability
    if (paymentStatus === "completed" && booking.paymentStatus !== "completed") {
      const event = await Event.findById(booking.event);
      event.availableTickets -= booking.tickets;
      await event.save();

      // Send confirmation email
      await sendBookingConfirmation(booking);
    }

    await booking.save();

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send booking confirmation email
const sendBookingConfirmation = async (booking) => {
  try {
    await booking.populate("event");
    await booking.populate("user", "name email");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: `Booking Confirmation - ${booking.event.title}`,
      html: `
        <h2>Booking Confirmation</h2>
        <p>Dear ${booking.user.name},</p>
        <p>Your booking has been confirmed!</p>
        <h3>Event Details:</h3>
        <ul>
          <li><strong>Event:</strong> ${booking.event.title}</li>
          <li><strong>Date:</strong> ${new Date(booking.event.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${booking.event.time}</li>
          <li><strong>Venue:</strong> ${booking.event.venue.name}, ${booking.event.venue.city}</li>
          <li><strong>Tickets:</strong> ${booking.tickets}</li>
          <li><strong>Total Amount:</strong> $${booking.totalAmount}</li>
        </ul>
        <p>Thank you for your booking!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// @desc    Send event reminder
// @route   POST /api/bookings/:id/reminder
// @access  Private
exports.sendReminder = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.reminderSent) {
      return res.status(400).json({
        success: false,
        message: "Reminder already sent",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.user.email,
      subject: `Event Reminder - ${booking.event.title}`,
      html: `
        <h2>Event Reminder</h2>
        <p>Dear ${booking.user.name},</p>
        <p>This is a reminder about your upcoming event!</p>
        <h3>Event Details:</h3>
        <ul>
          <li><strong>Event:</strong> ${booking.event.title}</li>
          <li><strong>Date:</strong> ${new Date(booking.event.date).toLocaleDateString()}</li>
          <li><strong>Time:</strong> ${booking.event.time}</li>
          <li><strong>Venue:</strong> ${booking.event.venue.name}, ${booking.event.venue.city}</li>
          <li><strong>Tickets:</strong> ${booking.tickets}</li>
        </ul>
        <p>We look forward to seeing you there!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    booking.reminderSent = true;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Reminder sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("event")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

