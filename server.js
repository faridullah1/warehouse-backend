const app = require('./app');

const sequelize = require('./db');
await = sequelize.sync();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});

module.exports = server;