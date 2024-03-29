const Sequelize = require('sequelize');
const Joi = require('joi');

const db = require('../db');
const { Department } = require('./departmentModel');

const User = db.define('user', 
{
	userId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING(100),
		allowNull: false,
        validate: {
			notNull: {
				msg: 'Name is required'
			}
		}
	},
	username: {
		type: Sequelize.STRING(50),
		allowNull: false,
		unique: true,
        validate: {
			notNull: {
				msg: 'Username is required'
			}
		}
	},
	email: {
		type: Sequelize.STRING(255),
		allowNull: false,
        validate: {
			notNull: {
				msg: 'Email is required'
			},
            isEmail: {
				msg: 'Email is invalid'
			}
		}
	},
	password: {
		type: Sequelize.STRING(100),
		allowNull: false,
        validate: {
			notNull: {
				msg: 'Password is required'
			}
		}
	},
	type: {
		type: Sequelize.ENUM("Admin", "User"),
		allowNull: false,
		defaultValue: "User",
        validate: {
			notNull: {
				msg: 'Type is required'
			}
		}
	},
	language: {
		type: Sequelize.ENUM("en", "nl"),
		allowNull: false,
		defaultValue: "en",
	},
	departmentId: {
		type: Sequelize.INTEGER,
		allowNull: false,
		references: {
			model: Department,
			key: 'departmentId',
			onDelete: 'RESTRICT'
		}
	},
}, {
	defaultScope: {
		attributes: { exclude: ['password'] },
	}
});

function validateUser(user) {
	const schema = Joi.object({
		name: Joi.string().required().min(3).max(100),
		username: Joi.string().required().max(50),
		email: Joi.string().required().email().max(255),
		password: Joi.string().required().min(8).max(100),
		type: Joi.string().valid(...User.getAttributes().type.values),
		language: Joi.string().valid(...User.getAttributes().language.values),
		departmentId: Joi.number().required(),
	});

	return schema.validate(user);
}

exports.validate = validateUser;
exports.User = User;