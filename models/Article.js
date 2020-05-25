const mongoose = require("mongoose");

const clubArticleSchema = new mongoose.Schema({
  club: {
    type: mongoose.Schema.Types.ObjectId,
    refs: "clubs",
  },
  title: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },

  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ClubArticle", clubArticleSchema);
