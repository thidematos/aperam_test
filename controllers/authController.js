const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const SendMail = require('./../utils/email');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendCookie = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000
    ),
    httpOnly: process.env.NODE_ENV === 'development' ? false : true,
    secure: process.env.NODE_ENV === 'development' ? true : true,
    sameSite: 'Strict',
  };

  user.password = undefined;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'sucess',
    data: {
      user: user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;

  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
  });

  createSendCookie(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password)
    return next(new AppError('Please, provide an email and password', 400));

  const user = await User.findOne({ email: email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Usuário ou senha incorretos!', 401));

  createSendCookie(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  //Verifies if the token is valid.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('Usuário não está autenticado.', 401));

  //Decode Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //Verifies is the User exists
  const currentUser = await User.findById(decoded.id).select('+role');

  if (!currentUser) return next(new AppError('Usuário não encontrado!', 401));

  if (currentUser.changedPasswordAfter(decoded.iat))
    return next(new AppError('Usuário não está autenticado.', 401));

  req.user = currentUser;
  next();
});

exports.restrictTo = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role))
      return next(
        new AppError('Você não está autorizado a acessar essa página.', 403)
      );

    next();
  };
};

exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.resetToken;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiration: { $gt: Date.now() },
  });

  if (!user)
    return next(
      new AppError(
        'Atualização de senha falhou: token inválido. Por favor, tente novamente.',
        400
      )
    );

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpiration = undefined;

  await user.save();

  createSendCookie(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError('Usuário não encontrado', 404));

  const resetToken = user.getPasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  await new SendMail().sendDummyMail({
    example: 'send password reset',
    resetToken,
  });

  res.status(200).json({
    status: 'success',
    message: 'Reset token enviado',
  });
});
