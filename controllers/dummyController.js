const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Dummy = require('./../models/dummyModel');

exports.getAllDummies = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Dummy.find({}), req.query);

  features.filter().sort().selectFields().paginate();

  const dummies = await features.mongoQuery;

  res.status(200).json({
    status: 'sucess',
    data: {
      dummies,
    },
  });
});

exports.getDummy = catchAsync(async (req, res, next) => {
  const dummy = await Dummy.findById(req.params.id);

  if (!dummy) next(new AppError('Could not find this dummy', 404));

  res.status(200).json({
    status: 'sucess',
    data: {
      dummy,
    },
  });
});

exports.createDummy = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newDummy = await Dummy.create({
    name,
  });

  res.status(201).json({
    status: 'sucess',
    data: {
      dummy: newDummy,
    },
  });
});

exports.updateDummy = catchAsync(async (req, res, next) => {
  const updatedDummy = await Dummy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedDummy) next(new AppError('Could not find any dummy', 404));

  res.status(200).json({
    status: 'sucess',
    data: {
      dummy: updatedDummy,
    },
  });
});

exports.deleteDummy = catchAsync(async (req, res, next) => {
  await Dummy.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  const sizes = {
    width: 1080,
    height: 720,
  };

  const dummyName = `dummy-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(sizes.width, sizes.height)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/${coverName}`);

  req.body.dummyName = dummyName;

  next();
});
