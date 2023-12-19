const bcrypt = require("bcrypt");
const { validationResult, body } = require("express-validator");
const fs = require("fs");
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
    const uploadDir = "./public/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let imagePath = null;

    if (req.files && req.files.avatar) {
      const uploadImage = req.files.avatar;
      const uploadPath = __dirname + "/../public/uploads/" + uploadImage.name;

      await uploadImage.mv(uploadPath);

      imagePath = "/uploads/" + uploadImage.name;
    }
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      password: req.body.password,
      avatar: imagePath,
    });

    res.status(201).redirect("/login");
  } catch (error) {
    const errors = validationResult(req);
    console.log(error.message);
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
    } else {
      req.flash("error", "User not exist!");
    }
    res.redirect("/login");
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
  const users = await User.find();
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
    users,
  });
};

exports.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findByIdAndRemove(req.params.id);
    const course = await Course.deleteMany({ user: req.params.id });

    if (deleteUser.avatar) {
      let deleteImage = __dirname + "/../public" + deleteUser.avatar;
      fs.unlinkSync(deleteImage);
    }

    req.flash("success", `${deleteUser.name} deleted successfully`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
