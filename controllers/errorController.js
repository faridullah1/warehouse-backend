const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		err: err,
		stack: err.stack
	});
}

const sendErrorProd = (err, res) => {
	let errorMessage = err.message;

	if (err.name) {
		switch(err.name) {
            case 'SequelizeValidationError':
				errorMessage = err.errors[0].message;
                err.statusCode = 400;
				break;

			case 'SequelizeUniqueConstraintError':
				const field = Object.entries(err.fields);
				errorMessage = `${field[0][0]} already exists`;
				break;

			case 'JsonWebTokenError':
				err.statusCode = 401;
				errorMessage = 'Invalid token. Please log in again';
				break;

			case 'TokenExpiredError':
				err.statusCode = 401;
				errorMessage = 'Your token is expired. Please log in again';
				break;
		}
	}

	res.status(err.statusCode).json({
		status: err.status,
		message: errorMessage,
	});
}

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	}
	else if (['production', 'test'].includes(process.env.NODE_ENV)) {
		sendErrorProd(err, res);
	}
}