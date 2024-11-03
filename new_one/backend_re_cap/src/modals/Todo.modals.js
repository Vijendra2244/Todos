const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments",
    },
  ],
});

const Todos = mongoose.model("Todos", TodoSchema);

module.exports = {
  Todos,
};
