const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const Userschema = new Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
});

Userschema.pre("save", async function (next) {
  const user = this;
  try {
    if (!user.isModified("password")) {
      return next();
    }

    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", Userschema);

module.exports = User;
