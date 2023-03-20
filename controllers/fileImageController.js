const { FileImage } = require('../models/fileImageModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllFileImages = catchAsync(async (req, res, next) => {
    // #swagger.tags = ['FileImage']
    // #swagger.description = 'Endpoint for getting all pictures created so far'

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