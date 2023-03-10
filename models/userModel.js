const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', 
{
	userId: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
        validate: {
			notNull: {
				msg: 'Name is required'
			}
		}
	},
	email: {
		type: Sequelize.STRING,
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
	mobileNumber: {
		type: Sequelize.STRING(10),
		allowNull: false,
		unique: true,
        validate: {
			notNull: {
				msg: 'Mobile number is required'
			}
		}
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false,
        validate: {
			notNull: {
				msg: 'Password is required'
			}
		}
	}
}, {
	defaultScope: {
		attributes: { exclude: ['password'] },
	}
});

exports.User = User;