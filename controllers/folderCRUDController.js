const prisma = require("../db/prisma");
const supabase = require("../config/supabase");
const { nanoid } = require("nanoid");

exports.getFolderPage = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  const files = await prisma.file.findMany({
    where: { folderId },
    orderBy: { createdAt: "desc" },
  });

  const filesWithUrls = await Promise.all(
    files.map(async (file) => {
      const { data, error } = await supabase.storage
        .from("Uploads")
        .createSignedUrl(file.storedName, 3600 * 24);

      if (error) {
        console.error("Signed URL error:", error);
        return { ...file, signedUrl: null };
      }

      return { ...file, signedUrl: data.signedUrl };
    })
  );

  const subfolders = await prisma.folder.findMany({
    where: { parentId: folderId },
    orderBy: { createdAt: "asc" },
  });

  res.locals.files = filesWithUrls;
  res.locals.folderId = folderId;
  res.locals.subfolders = subfolders;
  res.render("folder");
};

exports.createFolder = async (req, res) => {
  const root = await prisma.folder.findFirst({
    where: {
      userId: req.user.id,
      parentId: null,
      visible: false,
    },
  });

  if (!root) return res.status(500).send("Root folder missing");

  const { name } = req.body;
  await prisma.folder.create({
    data: {
      name,
      userId: req.user.id,
      parentId: root.id,
    },
  });
  res.redirect("/home");
};

exports.createSubFolder = async (req, res) => {
  const { name } = req.body;
  await prisma.folder.create({
    data: {
      name,
      userId: req.user.id,
      parentId: parseInt(req.params.id, 10),
    },
  });
  res.redirect(`/folders/${req.params.id}`);
};

exports.renameFolder = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  await prisma.folder.update({
    where: { id: folderId },
    data: { name: req.body.newName },
  });
  res.redirect("/home");
};

exports.deleteFolder = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  await prisma.folder.delete({ where: { id: folderId } });
  res.redirect("/home");
};

exports.shareFolder = async (req, res) => {
  const folderId = parseInt(req.params.id, 10);
  const { duration } = req.body; // duration in days

  const { nanoid } = require("nanoid");
  const shareId = nanoid();

  // Save share info to DB
  await prisma.folderShare.create({
    data: {
      folderId,
      shareId,
      expiresAt: new Date(Date.now() + duration * 24 * 60 * 60 * 1000), // days to ms
    },
  });

  // Return JSON with shareable link
  res.json({ link: `https://yourapp.com/share/${shareId}` });
};
