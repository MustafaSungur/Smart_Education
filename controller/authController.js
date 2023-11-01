const User = require("../models/User");

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({
    status: "success",
    user,
  });
};
