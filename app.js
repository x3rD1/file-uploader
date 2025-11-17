const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
require("dotenv").config();

const app = express();
const prisma = require("./db/prisma");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET || "cats",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

require("./config/passport");

app.use(passport.session());
// add custom middleware for locals

// Routes
const indexRouter = require("./routes/indexRouter");

app.use("/", indexRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;

  console.log("App listening on port 3000");
});
