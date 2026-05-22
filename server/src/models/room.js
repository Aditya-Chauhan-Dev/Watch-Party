const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  socketId: {
    type: String,
  },

  username: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ["host", "moderator", "participant"],
    default: "participant",
  },
});

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },

    videoId: {
      type: String,
      default: "xeXV1KoX034",
    },

    currentTime: {
      type: Number,
      default: 0,
    },

    isPlaying: {
      type: Boolean,
      default: false,
    },

    participants: [participantSchema],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Room", roomSchema);
