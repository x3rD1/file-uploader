const prisma = require("../db/prisma");
const supabase = require("../config/supabase");

exports.getHomePage = async (req, res) => {
  const root = await prisma.folder.findFirst({
    where: { userId: req.user.id, visible: false, parentId: null },
  });

  if (!root) {
    return res.status(500).send("Root folder missing");
  }

  const folders = await prisma.folder.findMany({
    where: { parentId: root.id },
    orderBy: { createdAt: "asc" },
  });

  const files = await prisma.file.findMany({
    where: { folder: { userId: req.user.id } },
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

  res.locals.files = filesWithUrls;
  res.locals.folders = folders;
  res.locals.root = root;
  res.locals.folderId = "";
  console.log(root);
  res.render("home");
};
