const express = require("express");
const authController = require("../controller/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const { body } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

router.route("/singup").post(authController.createUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboardPage);

module.exports = router;
