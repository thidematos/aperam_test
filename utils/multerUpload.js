const multer = require('multer');
const multerStorage = multer.memoryStorage();
const AppError = require('./../utils/appError');

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/'))
    cb(new AppError('Não foi detectado um arquivo de imagem.', 400), 400);
  cb(null, true);
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

module.exports = upload;
