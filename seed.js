const dotEnv = require('dotenv');
const bcrypt = require('bcrypt');

dotEnv.config({ path: './config.env'});
require('./associations')();

const sequelize = require('./db');
await = sequelize.sync();

const { Department } = require('./models/departmentModel');
const { User } = require('./models/userModel');

const counts = 2;

createDepartments = async () => {
    for (let i=0; i<counts; i++) {
        await Department.create({ name: `Department ${i+1}`});
    }
}

createSuperAdmins = async () => {
    for (let i=0; i<counts; i++) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash('pakistan', salt);

        const user = { 
            name: `Admin ${i+1}`, 
            email: `admin${i+1}@gmail.com`,
            username: `admin${i+1}`,
            password: encryptedPassword, 
            type: 'Admin', 
            language: 'en',
            departmentId: i+1 
        };

        await User.create(user);
    }
}

createWarehousePersonnel = async () => {
    for (let i=0; i<counts; i++) {
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash('pakistan', salt);

        const user = { 
            name: `User ${i+1}`, 
            email: `user${i+1}@gmail.com`, 
            password: encryptedPassword, 
            type: 'User',
            language: 'en',
            username: `user${i+1}`,
            departmentId: i+1
        };

        await User.create(user);
    }
}

initData = async () => {
    await createDepartments();
    console.log(`${counts} departments created...`);
    await createSuperAdmins();
    console.log(`${counts} super admins created...`);
    await createWarehousePersonnel();
    console.log(`${counts} warehouse personnel created...`);
}

initData();