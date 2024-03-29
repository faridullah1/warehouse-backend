const { Op } = require('sequelize');
const { FileImage } = require('../models/fileImageModel');
const { File } = require('../models/fileModel');
const { User } = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllFileImages = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['FileImage']
    // #swagger.description = 'Endpoint for getting all pictures created so far'

    const page = +req.query.page || 1;
	const limit = +req.query.limit || 10;

    const { reference, createdAt, isDamaged } = req.query;
    let where = {};

    if (reference) {
        where = {
            [Op.or]: [
                { reference: { [Op.iLike]: '%' + reference + '%' } }, 
                { containerNumber: { [Op.iLike]: '%' + reference + '%' } }
            ],   
        }
    }

    if (isDamaged) {
        where['noOfDamagedGoods'] = { [Op.gt]: 0 }
    }

    if (createdAt) {
        where['createdAt'] = { [Op.gt]: new Date(createdAt['gt']), [Op.lt]: new Date(createdAt['lt']) };
    }

    const offset = (page - 1) * limit;

    const pictures = await FileImage.findAndCountAll({
        limit,
        offset,
        include: 
        [
            {
                model: File,
                where,
                attributes: ['fileId', 'reference', 'containerNumber']
            },
            {
                model: User,
                attributes: ['name']
            }
        ],
        attributes: ['fileImageId', 'url', 'createdAt'],
        order: [
            ['createdAt', 'DESC']
        ]
    });

    res.status(200).json({
        status: 'success',
        data: {
            pictures
        }
    });
});

exports.deleteFileImage = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['FileImage']
    // #swagger.description = 'Endpoint for deleting a file image by its Id.'

    const fileImageId = +req.params.id;

	const image = await FileImage.destroy({ where: { fileImageId }});

    if (!image) return next(new AppError('Image with the given id not found', 404));

    res.status(204).json({
        status: 'success',
        data: { 
            image
        }
    });
});