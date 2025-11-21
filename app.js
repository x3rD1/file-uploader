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
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
// Routes
const indexRouter = require("./routes/indexRouter");
const loginRouter = require("./routes/loginRouter");
const signupRouter = require("./routes/signupRouter");
const homeRouter = require("./routes/homeRouter");
const folderRouter = require("./routes/folderRouter");
const fileRouter = require("./routes/fileRouter");

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/home", homeRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (error) => {
  if (error) throw error;

  console.log("App listening on port 3000");
});
