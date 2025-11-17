const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// TODO
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await prisma.user.findUnique({ where: { username } });
      const user = rows[0];

      // Check if user does not exist
      if (!user) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      // Check if entered password is incorrect
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect username or password" });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await prisma.user.findUnique({ where: { id } });
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
