const { Router } = require("express");
const signupRouter = Router();
const signupController = require("../controllers/signupController");
const { validateSignup } = require("../validators/signupValidator");

signupRouter.get("/", signupController.getSignupPage);
signupRouter.post("/", validateSignup, signupController.createAccount);

module.exports = signupRouter;
