const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const xssClean = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');

const dummyRouter = require('./routers/dummyRouter');
const talhaoRouter = require('./routers/talhaoRouter');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests have been made!',
});

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(cookieParser());

app.use(morgan('dev'));

app.use(cors());

app.use(mongoSanitize());

app.use(xssClean());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

if (process.env.NODE_ENV === 'production') app.use('/api', limiter);

app.use('/api/v1/talhao', talhaoRouter);

//Routing react-route-dom
app.all('/*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.all('/api/v1/*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl} in this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
