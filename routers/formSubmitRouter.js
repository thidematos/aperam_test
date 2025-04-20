const express = require('express');
const multer = require('multer');
const router = express.Router();
const upload = require('./../utils/multerUpload');
const photoController = require('./../controllers/photoController');

router.post(
  '/photo',
  upload.single('photo'),
  photoController.resizeImages,
  photoController.dispatchResponse
);

module.exports = router;
