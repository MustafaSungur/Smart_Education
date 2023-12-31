const express = require("express");
const authController = require("../controller/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/singup").post(authController.createUser);
router.route("/login").post(authController.loginUser);
router.route("/logout").get(authController.logoutUser);
router.route("/:id").delete(authController.deleteUser);
router.route("/dashboard").get(authMiddleware, authController.getDashboardPage);

module.exports = router;
