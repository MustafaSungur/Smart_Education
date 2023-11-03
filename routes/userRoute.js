const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/singup").post(authController.createUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);

module.exports = router;
