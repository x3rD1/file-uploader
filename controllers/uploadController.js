const prisma = require("../db/prisma");

exports.getUploadPage = async (req, res) => {
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });

  const files = await prisma.file.findMany({
    where: { folder: { userId: req.user.id } },
  });

  res.locals.folders = folders;
  res.locals.files = files;
  res.render("upload");
};
