const express = require("express");

const categoryController = require("../controller/categoryController");

const router = express.Router();

router.route("/").post(categoryController.createCategory);
router.route("/:id").delete(categoryController.deleteCategory);
router.route("/:id").put(categoryController.updateCategory);

module.exports = router;
