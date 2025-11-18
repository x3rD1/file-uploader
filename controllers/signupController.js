exports.getSignupPage = (req, res) => {
  res.locals.errors = [];
  res.locals.oldInput = {};
  res.render("signup");
};

exports.createAccount = async (req, res) => {
  const errors = validationResult(req);
  // Map to only first error per field
  const errorMap = {};
  errors.array().forEach((err) => {
    if (!errorMap[err.path]) {
      errorMap[err.path] = err.msg;
    }
  });
  // Define locals
  res.locals.errors = errorMap || {};
  res.locals.oldInput = req.body || {};

  if (!errors.isEmpty()) {
    return res.status(400).render("signup");
  }

  // Create user
  const { username, password } = req.body;
  await prisma.user.create({
    data: {
      username,
      password: await bcrypt.hash(password, 10),
    },
  });

  res.redirect("/login");
};
