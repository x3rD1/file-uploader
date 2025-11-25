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
  try {
    const folderId = parseInt(req.params.id, 10);

    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder) return res.status(404).send("Folder not found");

    const bucket = "Uploads";

    if (folder.files.length > 0) {
      const filePaths = folder.files.map((f) => f.storedName);

      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove(filePaths);

      if (storageError) throw storageError;
    }

    await prisma.folder.delete({
      where: { id: folderId },
    });

    const referer = req.headers.referer || "";
    if (folder.parentId && referer.includes(`/folders/${folder.parentId}`)) {
      return res.redirect(`/folders/${folder.parentId}`);
    }

    res.redirect("/home");
  } catch (err) {
    console.error("Folder delete error:", err);
    res.status(500).send("Failed to delete folder");
  }
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
  res.json({
    link: `https://file-uploader-production-ea6d.up.railway.app/folders/share/${shareId}`,
  });
};

exports.viewSharedFolder = async (req, res) => {
  try {
    const shareId = req.params.shareId;

    const share = await prisma.folderShare.findUnique({
      where: { shareId },
      include: { folder: true },
    });

    if (!share) return res.status(404).send("Invalid share link");

    if (share.expiresAt < new Date()) {
      return res.status(410).send("This link has expired");
    }

    const folders = await prisma.folder.findMany({
      where: { parentId: share.folderId },
    });

    const files = await prisma.file.findMany({
      where: { folderId: share.folderId },
    });

    const filesWithSignedUrl = await Promise.all(
      files.map(async (file) => {
        const { data, error } = await supabase.storage
          .from("Uploads")
          .createSignedUrl(file.storedName, 3600 * 24); // valid 1 day

        return {
          ...file,
          signedUrl: data?.signedUrl || null,
        };
      })
    );

    res.render("sharedFolder", {
      shareId,
      folderId: share.folderId,
      folder: share.folder,
      folders,
      files: filesWithSignedUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load shared folder");
  }
};

exports.viewSharedSubfolder = async (req, res) => {
  try {
    const { shareId, folderId } = req.params;

    const share = await prisma.folderShare.findUnique({
      where: { shareId },
      include: { folder: true },
    });

    if (!share) return res.status(404).send("Invalid share link");
    if (share.expiresAt < new Date())
      return res.status(410).send("This link has expired");

    // Fetch contents of clicked folder
    const folders = await prisma.folder.findMany({
      where: { parentId: parseInt(folderId) },
    });

    const files = await prisma.file.findMany({
      where: { folderId: parseInt(folderId) },
    });

    // Generate signed URLs for files
    const filesWithSignedUrl = await Promise.all(
      files.map(async (file) => {
        const { data } = await supabase.storage
          .from("Uploads")
          .createSignedUrl(file.storedName, 3600 * 24);

        return { ...file, signedUrl: data?.signedUrl };
      })
    );

    res.render("sharedFolder", {
      shareId,
      folderId,
      folder: { name: "Shared Folder" },
      folders,
      files: filesWithSignedUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to load shared folder");
  }
};

exports.downloadSharedFile = async (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);

    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).send("File not found");

    const { data, error } = await supabase.storage
      .from("Uploads")
      .createSignedUrl(file.storedName, 60 * 60); // 1 hour

    if (error) throw error;

    const url = `${data.signedUrl}&download=${encodeURIComponent(
      file.originalName
    )}`;
    res.redirect(url);
  } catch (err) {
    console.error(err);
    res.status(500).send("Download failed");
  }
};
