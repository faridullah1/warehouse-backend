const { Department } = require("./models/departmentModel");
const { User } = require("./models/userModel");

module.exports = function() {
    Department.hasMany(User, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'departmentId'});
    User.belongsTo(Department, { foreignKey: 'departmentId' });
}