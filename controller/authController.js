const bcrypt = require("bcrypt");
const { validationResult, body } = require("express-validator");

const User = require("../models/User");
const Category = require("../models/Category");
const Course = require("../models/Course");

exports.createUser = async (req, res) => {
  // Define validation rules using express-validator
  const validationRules = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .isEmail()
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          if (user) {
            return Promise.reject("Email is already exists!");
          }
        });
      }),
    body("password").notEmpty().withMessage("Password is required"),
    // Add more validation rules as needed
  ];

  // Run the validation rules
  await Promise.all(validationRules.map((validation) => validation.run(req)));

  try {
    const user = await User.create(req.body);

    res.status(201).redirect("/login");
  } catch (error) {
    const errors = validationResult(req);

    for (let error of errors.errors) {
      req.flash("error", `${error.msg}`);
    }
    res.status(400).redirect("/register");
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
      } else {
        req.flash("error", "Your password is not correct!");
        res.status(400).redirect("/login");
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
  const user = await User.findById(req.session.userID).populate("courses");
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session.userID });

  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
  });
};
