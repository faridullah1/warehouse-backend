const compression = require('compression');
const dotEnv = require('dotenv');
const express = require('express');

const app = express();
dotEnv.config({ path: './config.env'});

app.use(express.json());
app.use(compression());

// Router handlers
const userRouter = require('./routes/userRoutes');
const authRouter = require('./routes/authRoutes');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Handling unhandled routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;