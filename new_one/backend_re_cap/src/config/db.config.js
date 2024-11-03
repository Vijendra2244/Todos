const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = mongoose.connect(process.env.MONGO_DB_URI);

module.exports = { connectDB };
