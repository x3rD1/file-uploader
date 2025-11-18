const { Router } = require("express");
const loginRouter = Router();
const loginController = require("../controllers/loginController");
const { isAuth } = require("../middlewares/auth");

loginRouter.get("/", loginController.getLoginPage);
loginRouter.post("/", loginController.postLogin);
loginRouter.get("/logout", isAuth, (req, res) => {
  req.logout((err) => {
    if (err) return err;

    res.redirect("/");
  });
});

module.exports = loginRouter;
