const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const UserSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  access_token: {
    type: String,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hasedPassword = await bcrypt.hash(this.password, 10);
    this.password = hasedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.VerifyPassword = async function (password) {
  try {
    const passwordChecked = await bcrypt.compare(password, this.password);
    return passwordChecked;
  } catch (error) {
    return error;
  }
};

UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { id: this._id, userEmail: this.email },
    process.env.ACCESS_SECRET_KEY
  );
};
UserSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    { id: this._id, userEmail: this.email },
    process.env.REFRESH_TOKEN_KEY
  );
};
const User = mongoose.model("User", UserSchema);

module.exports = { User };
