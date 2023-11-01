const express = require("express");
const pageController = require("../controller/pageController");

const router = express.Router();

router.route("/").get(pageController.getIndex);
router.route("/about").get(pageController.getAbout);

module.exports = router;
