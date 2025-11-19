const prisma = require("../db/prisma");

exports.uploadFile = async (req, res) => {
  await prisma.file.create({
    data: {},
  });
};
