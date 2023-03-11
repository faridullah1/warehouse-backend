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
	email: {
		type: Sequelize.STRING(255),
		allowNull: false,
		unique: true,
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
		type: Sequelize.ENUM("Super_Admin", "Admin", "Warehouse_Personnel"),
		allowNull: false,
		defaultValue: "Warehouse_Personnel",
        validate: {
			notNull: {
				msg: 'Type is required'
			}
		}
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
		email: Joi.string().required().email().max(255),
		password: Joi.string().required().min(8).max(100),
		type: Joi.string().valid(...User.getAttributes().type.values),
		departmentId: Joi.number().required(),
	});

	return schema.validate(user);
}

exports.validate = validateUser;
exports.User = User;