const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    req.flash("success", `Successfully created ${category.name}`);
    res.status(201).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    req.flash("success", `Successfully deleted ${category.name}`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "Fail",
      error: error,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    category.name = req.body.name;
    category.save();

    req.flash("success", `update successfully`);
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: error.message,
    });
  }
};
