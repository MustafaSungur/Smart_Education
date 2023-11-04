const bcrypt = require("bcrypt");

const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const same = await bcrypt.compare(password, user.password);
      if (same) {
        // USER SESSION
        req.session.userID = user.id;
        return res.status(200).redirect("/users/dashboard");
      }
    }

    res.status(401).send("Invalid email or password");
  } catch (error) {
    res.status(500).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findById(req.session.userID);
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });
  console.log(courses);
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
  });
};
