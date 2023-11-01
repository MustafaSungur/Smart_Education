const express = require("express");
const authController = require("../controller/authController");
const router = express.Router();

router.route("/singup").post(authController.createUser);

module.exports = router;
