const mongoose = require("mongoose");
const fs = require("fs");

const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const category = await Category.findOne({ name: req.body.category });

    const uploadDir = "./public/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let imagePath = null;

    if (req.files && req.files.img) {
      const uploadImage = req.files.img;
      const uploadPath = __dirname + "/../public/uploads/" + uploadImage.name;

      await uploadImage.mv(uploadPath);

      imagePath = "/uploads/" + uploadImage.name;
    }

    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: category._id,
      user: req.session.userID,
      image: imagePath,
    });

    req.flash("success", `${course.name} created successfully`);
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", `Error: Course could not be created`);
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
    const query = req.query.search;

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }

    if (!query && !categorySlug) {
      (filter.name = ""), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");
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
    const user = await User.findById(req.session.userID);
    const categories = await Category.find();

    res.status(200).render("course", {
      course,
      user,
      page_name: "courses",
      categories,
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

    // ObjectId'ye dönüştürme
    const courseId = new mongoose.Types.ObjectId(req.body.course_id);
    const isExist = user.courses.includes(courseId);

    if (!isExist) {
      user.courses.push(courseId);
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

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndRemove({ slug: req.params.slug });
    const usersToUpdate = await User.find({ courses: course._id });

    if (course.image) {
      let deleteImage = __dirname + "/../public" + course.image;
      fs.unlinkSync(deleteImage);
    }
    for (const user of usersToUpdate) {
      user.courses.pull(course._id);
      await user.save();
    }
    req.flash("success", `${course.name} deleted successfully`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });

    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;

    const uploadDir = "./public/uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    if (req.files.img && course.img) {
      let deleteImage = __dirname + "/../public" + course.image;
      fs.unlinkSync(deleteImage);
    }

    let imagePath = null;

    if (req.files && req.files.img) {
      const uploadImage = req.files.img;
      const uploadPath = __dirname + "/../public/uploads/" + uploadImage.name;

      await uploadImage.mv(uploadPath);

      imagePath = "/uploads/" + uploadImage.name;
      course.image = imagePath;
    }
    course.save();

    req.flash("success", `${course.name} update successfully`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
