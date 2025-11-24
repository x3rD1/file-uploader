const { Router } = require("express");
const folderRouter = Router();
const folderController = require("../controllers/folderCRUDController");
const { isAuth } = require("../middlewares/auth");

folderRouter.get("/:id", isAuth, folderController.getFolderPage);
folderRouter.post("/create", isAuth, folderController.createFolder);
folderRouter.get("/share/:shareId", folderController.viewSharedFolder);
folderRouter.get(
  "/share/:shareId/folder/:folderId",
  folderController.viewSharedSubfolder
);
folderRouter.get(
  "/share/download/:fileId",
  folderController.downloadSharedFile
);

folderRouter.post("/:id/createSub", isAuth, folderController.createSubFolder);
folderRouter.post("/:id/rename", isAuth, folderController.renameFolder);
folderRouter.post("/:id/delete", isAuth, folderController.deleteFolder);
folderRouter.post("/:id/share", isAuth, folderController.shareFolder);

module.exports = folderRouter;
