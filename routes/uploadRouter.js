const { Router } = require("express");
const uploadRouter = Router();
const uploadController = require("../controllers/uploadController");
const folderController = require("../controllers/folderCRUDController");
const fileController = require("../controllers/fileCRUDController");
const { isAuth } = require("../middlewares/auth");
const upload = require("../config/multer");
const { folder } = require("../db/prisma");

uploadRouter.get("/", isAuth, uploadController.getUploadPage);
uploadRouter.post("/folders/create", isAuth, folderController.createFolder);
uploadRouter.post("/folders/delete/:id", isAuth, folderController.deleteFolder);
uploadRouter.post("/folders/rename/:id", isAuth, folderController.renameFolder);
uploadRouter.post(
  "/files/upload",
  isAuth,
  upload.single("file"),
  fileController.uploadFile
);

module.exports = uploadRouter;
