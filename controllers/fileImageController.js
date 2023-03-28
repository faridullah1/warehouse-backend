const { FileImage } = require('../models/fileImageModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getAllFileImages = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['FileImage']
    // #swagger.description = 'Endpoint for getting all pictures created so far'

    const pictures = await FileImage.findAll({
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