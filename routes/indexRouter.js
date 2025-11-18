const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexControllers");
const { isAuth } = require("../middlewares/auth");
indexRouter.get("/", indexController.getIndexPage);
indexRouter.get("/welcome", isAuth, (req, res) => {
  res.render("welcome");
});

module.exports = indexRouter;
