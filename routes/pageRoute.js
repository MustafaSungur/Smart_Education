const express = require("express");
const pageController = require("../controller/pageController");
const redirectMiddleware = require("../middlewares/redirectMiddleware");

const router = express.Router();

router.route("/").get(pageController.getIndex);
router.route("/about").get(pageController.getAbout);
router
  .route("/register")
  .get(redirectMiddleware, pageController.getRegisterPage);
router.route("/login").get(redirectMiddleware, pageController.getLoginPage);

module.exports = router;
