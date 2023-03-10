// Built in packages
const { promisify } = require('util');

// 3rd party packages
const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/userModel');

// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.auth = catchAsync(async (req, res, next) => {
	// 1) Getting token and checking if it is there;
	let token = '';
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		token = req.headers.authorization.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Access denied. No token provided..', 401));
	}

	// 2) Token verification;
	let decoded;
	decoded = await promisify(jwt.verify)(token, process.env.JWT_PRIVATE_KEY);

	// 3) Check if user still exists;
	if (decoded) {
		const currentUser = await User.findByPk(decoded.userId);
		if (!currentUser) {
			return next(new AppError('The user belongs to the token does no longer exists.', 401));
		}
        
		req.user = currentUser.dataValues;
	}
	
	// Grant access to protected route;
	next();
});