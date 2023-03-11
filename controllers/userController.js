const bcrypt = require('bcrypt');

const { User, validate } = require("../models/userModel");
const AppError = require("../utils/AppError");
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll();

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

    const { name, email, password, type, departmentId } = req.body;

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({ name, email, password: encryptedPassword, type, departmentId });
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