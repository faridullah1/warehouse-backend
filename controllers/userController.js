const bcrypt = require('bcrypt');
const Joi = require('joi');
const { Op } = require('sequelize');

const { User, validate } = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;
	const search = req.query;

    const where = {
        type: 'Warehouse_Personnel'
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
        order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
        status: 'success',
        data: {
            users
        }
    });
});

exports.createUser = catchAsync(async (req, res, next) => {
    const { error } = validate(req.body);
	if (error) return next(new AppError(error.message, 400));

    const { name, email, password, type } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({ name, email, password: encryptedPassword, type, departmentId: req.user.departmentId });
	delete user.dataValues.password;

    res.status(201).json({
        status: 'success',
        data: { 
            user
        }
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
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
	const { error } = validateAdmin(req.body);
	if (error) return next(new AppError(error.message, 400));

	const { name, email, password, departmentId } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({ 
		name, 
		email, 
		password: encryptedPassword,
		type: 'Super_Admin',
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
		type: Joi.string().valid('Super_Admin'),
		departmentId: Joi.number().required(),
	});

	return schema.validate(user);
}