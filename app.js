const compression = require('compression');
const dotEnv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const express = require('express');

const app = express();
dotEnv.config({ path: './config.env'});

app.use(express.json());
app.use(compression());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Router handlers
const userRouter = require('./routes/userRoutes');
const departmentRouter = require('./routes/departmentRoutes');
const fileRouter = require('./routes/fileRoutes');
const fileImageRouter = require('./routes/fileImageRoutes');
const authRouter = require('./routes/authRoutes');

const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

app.use('/api/users', userRouter);
app.use('/api/departments', departmentRouter);
app.use('/api/files', fileRouter);
app.use('/api/fileImages', fileImageRouter);
app.use('/api/auth', authRouter);

// Handling unhandled routes
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;