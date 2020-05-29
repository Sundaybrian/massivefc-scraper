const mongoose = require("mongoose");

const clubVideoSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    refs: "clubs",
  },
  title: {
    type: String,
  },
  duration: {
    type: String,
  },
  url: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  scrappedDate: {
    type: Date,
  },
});

module.exports = mongoose.model("ClubVideos", clubVideoSchema);
