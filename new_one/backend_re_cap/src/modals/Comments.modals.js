const mongoose = require("mongoose");

const CommentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Comments = mongoose.model("Comments", CommentSchema);

module.exports = { Comments };
