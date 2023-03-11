const bcrypt = require('bcrypt');

const { Department } = require("../models/department");
const AppError = require("../utils/AppError");
const catchAsync = require('../utils/catchAsync');

exports.getAllDepartments = catchAsync(async (req, res, next) => {
    const departments = await Department.findAll();

    res.status(200).json({
        status: 'success',
        data: {
            departments
        }
    });
});

exports.createDepartment = catchAsync(async (req, res, next) => {
    const { name } = req.body;

	const department = await Department.create({ name });

    res.status(201).json({
        status: 'success',
        data: { 
            department
        }
    });
});

exports.deleteDepartment = catchAsync(async (req, res, next) => {
    const departmentId = +req.params.id;

	const department = await Department.destroy({ where: { departmentId }});

    if (!department) return next(new AppError('department with the given id not found', 404));

    res.status(204).json({
        status: 'success',
        data: { 
            department
        }
    });
});