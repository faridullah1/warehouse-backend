// 3rd party packages
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Models
const { User } = require('../models/userModel');

// Utils
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { Op } = require('sequelize');

exports.login = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['Auth']
    // #swagger.description = 'Endpoint for Sign In Warehouse personnel. There are 2 types of users for this application, Admin and Warehouse_Personnel'

	const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));

	const where = {};

	if (req.body.hasOwnProperty('username')) {
		where.username = req.body.username
	}
	else {
		where.email = req.body.email
	}
	
	let user = await User.findOne({ 
		where, 
		attributes: ['userId', 'name', 'email', 'password'] 
	});

	if (!user) return next(new AppError('Invalid email or password.', 400));

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) return next(new AppError('Invalid email or password.', 400));

	const token  = jwt.sign({ userId: user.userId, name: user.name, email: user.email }, process.env.JWT_PRIVATE_KEY, {
		expiresIn: process.env.JWT_EXPIRY
	});

	res.status(200).json({
		status: 'success',
		access_token: token
	});
});

exports.adminLogin = catchAsync(async (req, res, next) => {
	const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));

	let user = await User.findOne({ 
		where: {
			email: req.body.email,
			type: 'Admin' 
		},
		attributes: ['userId', 'name', 'email', 'password', 'type']
	});

	if (!user) return next(new AppError('Invalid email or password.', 400));

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if (!isValid) return next(new AppError('Invalid email or password.', 400));

	const token  = jwt.sign({ userId: user.userId, name: user.name, email: user.email, type: user.type }, process.env.JWT_PRIVATE_KEY, {
		expiresIn: process.env.JWT_EXPIRY
	});

	res.status(200).json({
		status: 'success',
		access_token: token
	});
});

function validate(req) {
	const schema = Joi.object({
		email: Joi.string().email(),
		username: Joi.string(),
		password: Joi.string().required()
	});

	return schema.validate(req); 
}