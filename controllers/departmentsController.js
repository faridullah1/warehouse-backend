const bcrypt = require('bcrypt');

const { Department } = require("../models/departmentModel");
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');

exports.getAllDepartments = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['Department']
    // #swagger.description = 'Endpoint for getting all departments'

    const departments = await Department.findAll();

    res.status(200).json({
        status: 'success',
        data: {
            departments
        }
    });
});

exports.createDepartment = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['Department']
    // #swagger.description = 'Endpoint for creating new department'

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
    // #swagger.tags = ['Department']
    // #swagger.description = 'Endpoint for deleting a department by its Id.'

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