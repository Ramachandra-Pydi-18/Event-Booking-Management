const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    category: {
      type: String,
      required: [true, "Event category is required"],
      enum: ["concert", "conference", "workshop", "sports", "theater", "other"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    venue: {
      name: {
        type: String,
        required: [true, "Venue name is required"],
      },
      address: {
        type: String,
        required: [true, "Venue address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
    },
    totalTickets: {
      type: Number,
      required: [true, "Total tickets is required"],
      min: 1,
    },
    availableTickets: {
      type: Number,
      required: [true, "Available tickets is required"],
      min: 0,
    },
    price: {
      type: Number,
      required: [true, "Ticket price is required"],
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
    organizer: {
      type: String,
      required: [true, "Organizer name is required"],
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "completed"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1 });

module.exports = mongoose.model("Event", eventSchema);

