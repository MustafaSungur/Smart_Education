const express = require("express");

const courseController = require("../controller/courseController");

const router = express.Router();

router.route("/").post(courseController.createCourse);
router.route("/").get(courseController.getAllCourses);
router.route("/course/:slug").get(courseController.getCourse);

module.exports = router;
