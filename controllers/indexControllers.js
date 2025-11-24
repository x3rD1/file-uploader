exports.getIndexPage = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("home");
  }
  res.render("index");
};
