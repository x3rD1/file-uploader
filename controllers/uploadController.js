exports.getUploadPage = (req, res) => {
  res.render("upload");
};

exports.uploadFile = async (req, res) => {
  res.send("Upload Successfully");
};
