const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Op } = require('sequelize');
const { Department } = require('../models/departmentModel');

const { User, validate } = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');

exports.me = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for getting logged in user profile.'

	const user = await User.findByPk(req.user.userId, 
		{ include: [{ model: Department, attributes: ['departmentId', 'name']} ]}
	);

    if (!user) return next(new AppError('user with the given id not found', 404));

    res.status(200).json({
        status: 'success',
        data: { 
            user
        }
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for getting all warehouse users. You can filter results by name'

    const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;
	const search = req.query;

    const where = {
		userId: { [Op.ne]: req.user.userId }
	};

	for (let key in search) {
		if (key === 'page' || key === 'limit') continue;

		if (key === 'name') {
			where.name = {
				[Op.like]: '%' + search['name'] + '%'
			}
		}
	}

    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
        offset,
        limit,
        where,
		include: [{
			model: Department,
			where: {
				departmentId: req.user.departmentId
			},
			attributes: ['departmentId', 'name']
		}],
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for getting warehouse user by its Id.'

	const userId = +req.params.id;

	const user = await User.findByPk(userId);

    if (!user) return next(new AppError('user with the given id not found', 404));

    res.status(200).json({
        status: 'success',
        data: { 
            user
        }
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for creating new warehouse user.'

    const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));

    const { name, username, email, password, type, language } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({ 
		name, 
		username, 
		email, 
		password: encryptedPassword, 
		type,
		language,
		departmentId: req.user.departmentId 
	});
	delete user.dataValues.password;

    res.status(201).json({
        status: 'success',
        data: { 
            user
        }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for updating warehouse user by its Id.'

	const userId = +req.params.id;

	const user = await User.update(req.body, { where: { userId }});

    if (!user) return next(new AppError('user with the given id not found', 404));

    res.status(200).json({
        status: 'success',
        data: { 
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for deleting warehouse user by its Id.'

    const userId = +req.params.id;

	const user = await User.destroy({ where: { userId }});

    if (!user) return next(new AppError('user with the given id not found', 404));

    res.status(204).json({
        status: 'success',
        data: { 
            user
        }
    });
});

exports.createSuperAdmin = catchAsync(async (req, res, next) => {
	// #swagger.tags = ['User']
    // #swagger.description = 'Endpoint for creating super admin.'

	const { error } = validateAdmin(req.body);
	if (error) return next(new AppError(error.message, 400));

	const { name, email, password, departmentId } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({ 
		name, 
		email, 
		password: encryptedPassword,
		type: 'Admin',
		departmentId
	});
	delete user.dataValues.password;
	
	res.status(201).json({
		status: 'success',
		data: {
			user
		}
	});
});

validateAdmin = (user) => {
	const schema = Joi.object({
        name: Joi.string().required().min(3).max(100),
		email: Joi.string().required().email().max(255),
		password: Joi.string().required().min(8).max(100),
		type: Joi.string().valid('Admin'),
		departmentId: Joi.number().required(),
	});

	return schema.validate(user);
}