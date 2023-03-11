const Sequelize = require('sequelize');
const db = require('../db');

const Department = db.define('department', 
{
	departmentId: {
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
			},
            notEmpty: {
				msg: 'Name is required'
			}
		}
	}
});

exports.Department = Department;