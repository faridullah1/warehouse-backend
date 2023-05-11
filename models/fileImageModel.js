const Sequelize = require('sequelize');
const db = require('../db');
const { File } = require('./fileModel');
const { User } = require('./userModel');

const FileImage = db.define('file_image', 
{
	fileImageId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	url: {
		type: Sequelize.STRING,
		allowNull: false,
        validate: {
			notNull: {
				msg: 'url is required'
			},
            notEmpty: {
				msg: 'url is required'
			}
		}
	},
	fileId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: File,
			key: 'fileId',
			onDelete: 'RESTRICT'
		}
	},
	userId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: User,
			key: 'userId',
			onDelete: 'RESTRICT'
		}
	},
});

exports.FileImage = FileImage;