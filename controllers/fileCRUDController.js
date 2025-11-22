const prisma = require("../db/prisma");
const supabase = require("../config/supabase");
const upload = require("../config/multer");

exports.getFilePage = async (req, res) => {
  const fileId = parseInt(req.params.id, 10);
  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) return res.status(404).send("File not found");
  console.log(file);
  const { data, error } = await supabase.storage
    .from("Uploads")
    .createSignedUrl(file.storedName, 3600 * 24);

  if (error) return res.status(500).send("Failed to generate signed URL");
  res.locals.file = file;
  res.locals.signedUrl = data.signedUrl;
  res.render("viewFile");
};

exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw new Error("No file uploaded");
    const fileName = Date.now() + "-" + file.originalname;
    const bucket = "Uploads";

    // Upload file to supabase
    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, { contentType: file.mimetype });

    if (error) throw error;

    let folderId = parseInt(req.body.folderId, 10);
    let path = `/folders/${folderId}`;
    // Get root folder id
    if (!folderId) {
      const root = await prisma.folder.findFirst({
        where: { userId: req.user.id, parentId: null, visible: false },
      });
      folderId = root.id;
      path = "/home";
    }

    // Store file metadata in Postgresql
    await prisma.file.create({
      data: {
        originalName: file.originalname,
        storedName: fileName,
        mimeType: file.mimetype,
        size: file.size,
        folderId,
      },
    });
    res.redirect(path);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Upload failed" });
  }
};

exports.downloadFile = async (req, res) => {
  const file = await prisma.file.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  if (!file) return res.status(404).send("File not found");

  const { data, error } = await supabase.storage
    .from("Uploads")
    .createSignedUrl(file.storedName, 60 * 60 * 24);

  if (error) return res.status(500).send("Failed to generate signed URL");

  const downloadUrl = `${data.signedUrl}&download=${encodeURIComponent(
    file.originalName
  )}`;

  res.redirect(downloadUrl);
};

exports.deleteFile = async (req, res) => {
  try {
    const fileId = parseInt(req.params.id, 10);
    const file = await prisma.file.findUnique({ where: { id: fileId } });
    if (!file) return res.status(404).send("File not found");

    const bucket = "Uploads";
    const filePath = file.storedName;

    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (storageError) throw storageError;

    await prisma.file.delete({ where: { id: fileId } });

    res.redirect(`/folders/${file.folderId}`);
  } catch (err) {
    console.error("Delete error:", err);
    console.log(filePath);
    res.status(500).send("Failed to delete file");
  }
};
