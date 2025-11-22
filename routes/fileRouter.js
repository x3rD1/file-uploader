const { Router } = require("express");
const fileRouter = Router();
const fileController = require("../controllers/fileCRUDController");
const { isAuth } = require("../middlewares/auth");
const upload = require("../config/multer");

fileRouter.get("/:id", isAuth, fileController.getFilePage);
fileRouter.get("/:id/download", isAuth, fileController.downloadFile);
fileRouter.post("/:id/delete", isAuth, fileController.deleteFile);
fileRouter.post(
  "/upload",
  isAuth,
  upload.single("file"),
  fileController.uploadFile
);

module.exports = fileRouter;
