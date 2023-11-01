exports.getIndex = (req, res) => {
  res.status(200).render("index", {
    page_name: "index",
  });
};

exports.getAbout = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};
