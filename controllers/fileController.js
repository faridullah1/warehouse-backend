const multer = require('multer');
const { Op } = require('sequelize');
const { FileImage } = require('../models/fileImageModel');

const { File } = require("../models/fileModel");
const { User } = require('../models/userModel');
const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');
const uploadToS3 = require('../utils/s3Upload');

const containerNumberCharDict = {
    'a': 10, 'b': 12, 'c': 13, 'd': 14,
    'e': 15, 'f': 16, 'g': 17, 'h': 18,
    'i': 19, 'j': 20, 'k': 21, 'l': 23,
    'm': 24, 'n': 25, 'o': 26, 'p': 27,
    'q': 28, 'r': 29, 's': 30, 't': 31,
    'u': 32, 'v': 34, 'w': 35, 'x': 36,
    'y': 37, 'z': 38
};

const upload = multer({
	dest: 'temp/'
});

exports.uploadFilePictures = upload.array('pictures', 100);

// This endpoint is used by warehouse personnel to see his/her files uploaded since last seven days on mobile app.
exports.me = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for getting all files created by currently logged in user since last 7 days'

    const lastSevenDays = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const files = await File.findAll({
        where: { createdAt: { [Op.gte]: lastSevenDays } },

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


// This endpoint is used by admin to see all files on portal.
exports.getAllFiles = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for getting all files.'
    const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;

    const { reference, createdAt, isDamaged } = req.query;
    const where = {};

    if (reference) {
        where['reference'] = { [Op.like]: '%' + reference + '%' }
    }

    if (isDamaged) {
        where['noOfDamagedGoods'] = { [Op.gt]: 0 }
    }

    if (createdAt) {
        where['createdAt'] = { [Op.gt]: new Date(createdAt['gt']), [Op.lt]: new Date(createdAt['lt']) };
    }

    const offset = (page - 1) * limit;

    const files = await File.findAndCountAll({
        where,
        offset,
        limit,
        include: [
            {
                model: User,
                attributes: ['userId', 'name'],
                where: { departmentId: req.user.departmentId }
            },
            {
                model: FileImage,
                attributes: ['fileImageId', 'url', 'createdAt']
            }
        ],
        distinct: true,
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

checkContainerNumberValidity = (containerNumber) => {
    const [characters, digits] = containerNumber.split(' ');
    const [firstSixDigits, lastDigitToCheck] = digits.split('-'); 

    let sum = 0;
    let counter = 0;

    for (const char of characters) {
        sum += containerNumberCharDict[char.toLowerCase()] * Math.pow(2, counter);
        counter += 1;
    }
    
    for (const digit of firstSixDigits) {
        sum += parseInt(digit, 10) * Math.pow(2, counter);
        counter += 1;
    }

    const result = Math.trunc(sum / 11);
    const finalResult = result * 11;
    const lastDigit = sum - finalResult;

    return lastDigit == lastDigitToCheck
};

exports.createFile = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['File']
    // #swagger.description = 'Endpoint for creating new File. File has a reference number and can contain multiple pictures'

    const { reference, isDamaged, containerNumber } = req.body;

    if (containerNumber) {
        if (!checkContainerNumberValidity(containerNumber)) {
            return next(new AppError('Invalid container number', 400));
        }   
    }

    if (req.files.length === 0) {
        return next(new AppError('Upload atlease one image', 400));
    }

	const file = await File.create({ reference, containerNumber, userId: req.user.userId });

    const promises = [];
    req.files.forEach(file => promises.push(uploadToS3(file, '')));
    req.body.pictures = await Promise.all(promises);

    if (isDamaged === "true") {
        file.noOfDamagedGoods = req.files.length;
        await file.save();
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

    if (req.body.isDamaged === "true") {
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