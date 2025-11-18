const prisma = require("../db/prisma");
const bcrypt = require("bcryptjs");

const { validationResult } = require("express-validator");

exports.getIndexPage = (req, res) => {
  res.render("index");
};
