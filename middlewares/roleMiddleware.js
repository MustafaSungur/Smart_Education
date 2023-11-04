const User = require("../models/User");
module.exports = (roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.session.userID);
    const userRole = user.role;

    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(401).send("Permission Denied");
    }
  };
};
