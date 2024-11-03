const mongoose = require("mongoose");

const BlackListeSchema = mongoose.Schema({
  access_token: {
    type: String,
    required: true,
  },
});

const Black = mongoose.model("Black", BlackListeSchema);

module.exports = { Black };
