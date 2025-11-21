const prisma = require("../db/prisma");

exports.getFolderPage = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  const files = await prisma.file.findMany({
    where: { folderId },
  });

  res.locals.files = files;
  res.locals.folderId = folderId;
  res.render("folder");
};

exports.createFolder = async (req, res) => {
  const { name } = req.body;
  await prisma.folder.create({
    data: {
      name,
      userId: req.user.id,
    },
  });
  res.redirect("/upload");
};

exports.renameFolder = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  await prisma.folder.update({
    where: { id: folderId },
    data: { name: req.body.newName },
  });
  res.redirect("/upload");
};

exports.deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  await prisma.folder.delete({ where: { id: folderId } });
  res.redirect("/upload");
};
