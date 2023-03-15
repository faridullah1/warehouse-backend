const { FileImage } = require('../models/fileImageModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllFileImages = catchAsync(async (req, res, next) => {
    const pictures = await FileImage.findAll({
        attributes: ['url', 'createdAt'],
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