const AppError = require('../utils/appError');

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong...',
    });
  }
};

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateDb = (err) => {
  const message = `Esse email já existe: ${err.keyValue.email}`;
  const errorObj = new AppError(message, 400);

  return errorObj;
};

const handleJwtError = (err) => new AppError('Invalid token.', 401);

const handleJwtExpired = (err) => new AppError('Expired token', 401);

const handleValidationDb = (err) => {
  const errors = Object.values(err.errors).map((error) => err.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  console.log(err);

  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') sendErrorDev(err, res);

  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (err.name === 'CastType') error = handleCastErrorDb(err);

    if (err.code === 11000) error = handleDuplicateDb(err);

    if (err.name === 'ValidationError') error = handleValidationDb(err);

    if (err.name === 'JsonWebTokenError') error = handleJwtError(err);

    if (err.name === 'TokenExpiredError') error = handleJwtExpired(err);

    sendErrorProd(error, res);
  }
};
