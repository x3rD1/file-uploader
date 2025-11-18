exports.isAuth = (req, res, next) => {
  // Checks if the user is not logged in
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  next();
};
