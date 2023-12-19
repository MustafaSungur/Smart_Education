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
  avatar: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
});

Userschema.pre("save", async function (next) {
  const user = this;

  if (!this.name || !this.email || !this.password) {
    const error = new Error("Name, email, and password are required");
    return next(error);
  }

  if (!user.isModified("password")) {
    return next();
  }

  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash;

  next();
});

const User = mongoose.model("User", Userschema);

module.exports = User;
