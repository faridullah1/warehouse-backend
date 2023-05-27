const Translation = require("../utils/translate");

const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		err: err,
		stack: err.stack
	});
}

const sendErrorProd = (err, res, lang) => {
	let errorMessage = err.message;

	if (err.name) {
		switch(err.name) {
            case 'SequelizeValidationError':
                err.statusCode = 400;
				errorMessage = err.errors[0].message;
				break;

			case 'SequelizeUniqueConstraintError':
                err.statusCode = 400;
				const field = Object.entries(err.fields);
				const fieldTranslation = (new Translation).getTranslation(lang, field[0][0]);
				errorMessage = lang === 'en' ? `${fieldTranslation} already exists` : `${fieldTranslation} bestaat al`;
				break;

			case 'MulterError':
				err.statusCode = 400;
				errorMessage = 'File(s) is too large, maximum allowed size is 100MB'
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
	
	const userLanguage = req.user ? req.user.language : 'en';

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res, userLanguage);
	}
	else if (['production', 'test'].includes(process.env.NODE_ENV)) {
		sendErrorProd(err, res, userLanguage);
	}
}