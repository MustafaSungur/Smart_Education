const express = require("express");

const courseController = require("../controller/courseController");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();

router
  .route("/")
  .post(roleMiddleware(["teacher", "admin"]), courseController.createCourse);
router.route("/").get(courseController.getAllCourses);
router.route("/course/:slug").get(courseController.getCourse);
router.route("/course/:slug").delete(courseController.deleteCourse);
router.route("/course/:slug").put(courseController.updateCourse);
router.route("/enroll").post(courseController.enrollCourse);
router.route("/release").post(courseController.releaseCourse);

module.exports = router;
