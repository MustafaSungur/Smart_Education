const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.body.category });

    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: category._id,
      user: req.session.userID,
    });

    res.status(201).redirect("/courses");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.category;
    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }
    const courses = await Course.find(filter).sort("-createdAt");
    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const currentUser = await User.findById(req.session.userID);
    res.status(200).render("course", {
      course,
      role: currentUser.role,
      page_name: "courses",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    console.log(user.courses);
    isExist = user.courses.includes("new ObjectId('654b8e50721ea6a655892824')");
    console.log(isExist);
    if (!isExist) {
      await user.courses.push(req.body.course_id);
      await user.save();
    } else {
      console.log("already exist");
    }
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
