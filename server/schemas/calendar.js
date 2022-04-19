const mongoose = require("mongoose");

const { Schema } = mongoose;

const {
  Types: { ObjectId },
} = Schema;

const calendarSchema = new Schema({
  writer: {
    type: ObjectId,
    required: true,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
  allDay: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Calendar", calendarSchema);
