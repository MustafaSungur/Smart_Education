const User = require("../models/User");

module.exports = async (req, res, next) => {
  if (!req.session || !req.session.userID) {
    return res.redirect("/login"); // Oturum açılmamışsa veya oturum kimliği yoksa yönlendirme yapın
  }

  try {
    const user = await User.findById(req.session.userID);

    if (!user) {
      return res.redirect("/login"); // Kullanıcı bulunamazsa yönlendirme yapın
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
};
