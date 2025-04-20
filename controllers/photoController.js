const catchAsync = require('../utils/catchAsync');

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const sizes = {
    width: 300,
    height: 600,
  };

  const photoName = `photo-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(sizes.width, sizes.height)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/${photoName}`);

  req.photoName = photoName;

  next();
});

exports.dispatchResponse = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      photoURL: req.photoName,
    },
  });
});
