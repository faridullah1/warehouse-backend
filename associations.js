const { Department } = require("./models/departmentModel");
const { FileImage } = require("./models/fileImageModel");
const { File } = require("./models/fileModel");
const { User } = require("./models/userModel");

module.exports = function() {
    Department.hasMany(User, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'departmentId'});
    User.belongsTo(Department, { foreignKey: 'departmentId' });

    User.hasMany(File, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'userId'});
    File.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(FileImage, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'userId'});
    FileImage.belongsTo(User, { foreignKey: 'userId' });

    File.hasMany(FileImage, { constraints: true, OnDelete: 'RESTRICT', foreignKey: 'fileId'});
    FileImage.belongsTo(File, { foreignKey: 'fileId' });
}