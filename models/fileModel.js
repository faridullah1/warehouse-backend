const Sequelize = require('sequelize');
const db = require('../db');
const { User } = require('./userModel');

const File = db.define('file', 
{
	fileId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	reference: {
		type: Sequelize.STRING(100),
		allowNull: false,
        validate: {
			notNull: {
				msg: 'Reference is required'
			},
            notEmpty: {
				msg: 'Reference is required'
			}
		}
	},
	containerNumber: Sequelize.STRING(100),
	noOfDamagedGoods: {
		type: Sequelize.INTEGER,
		defaultValue: 0
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

exports.File = File;