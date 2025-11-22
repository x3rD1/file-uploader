const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../controllers/homeController");
const { isAuth } = require("../middlewares/auth");

homeRouter.get("/", isAuth, homeController.getHomePage);

module.exports = homeRouter;
