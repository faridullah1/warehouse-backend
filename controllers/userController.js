const bcrypt = require('bcrypt');

const { User } = require("../models/userModel");
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
    const { name, email, mobileNumber, password } = req.body;

    if (!password) return next(new AppError('Password is required.', 400));

	const salt = await bcrypt.genSalt(10);
	const encryptedPassword = await bcrypt.hash(password, salt);

	const user = await User.create({ name, email, mobileNumber, password: encryptedPassword });
	delete user.dataValues.password;

    res.status(201).json({
        status: 'success',
        data: { 
            user
        }
    });
});