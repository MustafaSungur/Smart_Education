const express = require("express");

const courseController = require("../controller/courseController");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post(roleMiddleware(["teacher", "admin"]), courseController.createCourse);
router.route("/").get(courseController.getAllCourses);
router.route("/course/:slug").get(courseController.getCourse);

module.exports = router;
