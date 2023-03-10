const Sequelize = require('sequelize');
const connection = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
	define: {
		charset: 'utf8',
		collate: 'utf8_general_ci', 
		timestamps: true
	},
	dialect: 'mysql',
	host: process.env.HOST,
});

module.exports = connection;