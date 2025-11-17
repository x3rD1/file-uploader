const { Router } = require("express");
const passport = require("passport");
const indexRouter = Router();
const indexController = require("../controllers/indexControllers");

indexRouter.get("/", indexController.getIndexPage);
indexRouter.post("/login", (req, res, next) => {
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
      return res.redirect("/");
    });
  })(req, res, next);
});

module.exports = indexRouter;
