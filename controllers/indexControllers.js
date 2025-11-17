const prisma = require("../db/prisma");

exports.getIndexPage = (req, res) => {
  res.render("index");
};

exports.getSignupPage = (req, res) => {
  res.render("signup");
};

exports.createAccount = async (req, res) => {};
