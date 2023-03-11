const multer = require('multer');

const { File } = require("../models/fileModel");
const AppError = require("../utils/AppError");
const catchAsync = require('../utils/catchAsync');
const uploadToS3 = require('../utils/s3Upload');

const upload = multer({
	dest: 'temp/'
});

exports.uploadFilePictures = upload.array('pictures', 100);

exports.getAllFiles = catchAsync(async (req, res, next) => {
    const files = await File.findAll({ where: { userId: req.user.userId }});

    res.status(200).json({
        status: 'success',
        data: {
            files
        }
    });
});

exports.createFile = catchAsync(async (req, res, next) => {
    if (req.files) {
		const promises = [];
		req.files.forEach(file => promises.push(uploadToS3(file, 'pictures')))
		req.body.pictures = await Promise.all(promises);
	}

    const { reference, pictures } = req.body;
	const file = await File.create({ reference, pictures, userId: req.user.userId });

    res.status(201).json({
        status: 'success',
        data: { 
            file
        }
    });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
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