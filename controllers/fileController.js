const multer = require('multer');
const { FileImage } = require('../models/fileImageModel');

const { File } = require("../models/fileModel");
const { User } = require('../models/userModel');
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');
const uploadToS3 = require('../utils/s3Upload');

const upload = multer({
	dest: 'temp/'
});

exports.uploadFilePictures = upload.array('pictures', 100);

exports.me = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for getting all files created by currently logged in user'

    const files = await File.findAll({
        include: [
            {
                model: User,
                attributes: ['userId', 'name'],
                where: { userId: req.user.userId }
            },
            {
                model: FileImage,
                attributes: ['url', 'createdAt']
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    });

    res.status(200).json({
        status: 'success',
        data: {
            files
        }
    });
});

exports.getAllFiles = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for getting all files.'

    const files = await File.findAll({
        include: [
            {
                model: User,
                attributes: ['userId', 'name'],
                where: { departmentId: req.user.departmentId }
            },
            {
                model: FileImage,
                attributes: ['url', 'createdAt']
            }
        ],
        order: [
            ['createdAt', 'DESC']
        ]
    });

    res.status(200).json({
        status: 'success',
        data: {
            files
        }
    });
});

exports.createFile = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for creating new File. File has a reference number and can contain multiple pictures'

    const { reference, isDamaged, containerNumber } = req.body;
	const file = await File.create({ reference, containerNumber, userId: req.user.userId });

    if (req.files) {
		const promises = [];
		req.files.forEach(file => promises.push(uploadToS3(file, '')));
		req.body.pictures = await Promise.all(promises);

        if (isDamaged) {
            file.noOfDamagedGoods = req.files.length;
            await file.save();
        }
	}

    for(let pic of req.body.pictures) {
    	await FileImage.create({url: pic, fileId: file.dataValues.fileId });
    }

    res.status(201).json({
        status: 'success',
        data: { 
            file
        }
    });
});

exports.updateFile = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for adding new pictues to an existing file.'

    const fileId = +req.params.id;
    const file = await File.findByPk(fileId);

    if (!file) return next(new AppError('user with the given id not found', 404));

    if (req.files) {
		const promises = [];
		req.files.forEach(file => promises.push(uploadToS3(file, '')));
		req.body.pictures = await Promise.all(promises);
	}

    for(let url of req.body.pictures) {
    	await FileImage.create({url, fileId });
    }

    if (req.body.isDamaged) {
        file.noOfDamagedGoods += req.files.length;
        await file.save();
    }

    res.status(200).json({
        status: 'success',
        data: { 
            file
        }
    });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for deleting a file by its Id.'

    const fileId = +req.params.id;

	const file = await File.destroy({ where: { fileId }});

    if (!file) return next(new AppError('file with the given id not found', 404));

    res.status(204).json({
        status: 'success',
        data: { 
            file
        }
    });
});