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
  },

  imageUrl: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

module.exports = mongoose.model("ClubArticle", clubArticleSchema);
