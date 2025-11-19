const fs = require("fs");
const path = require("path");
const multer = require("multer");
const uploadDir = path.join(__dirname, "../uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);

    let filename = file.originalname;
    let counter = 1;

    while (fs.existsSync(path.join(uploadDir, filename))) {
      filename = `${base} (${counter})${ext}`;
      counter++;
    }

    cb(null, filename);
  },
});
const upload = multer({ storage });

module.exports = upload;
