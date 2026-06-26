const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(express.static(`${__dirname}/public`));
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  // console.log(req.headers);
  next();
});
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP',
});

app.use('/api', limiter);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xssClean());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// mounting ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);
  // console.log(req.headers);
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

app.use(globalErrorHandler);

module.exports = app;
