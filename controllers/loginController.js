const passport = require("passport");

exports.getLoginPage = (req, res) => {
  res.locals.message = "";
  res.locals.oldInput = {};
  res.render("login");
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.render("login", {
        message: info.message,
        oldInput: { username: req.body.username },
      });
    }
    // Logs user in and sets up the session
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/welcome");
    });
  })(req, res, next);
};
