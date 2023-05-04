const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        version: "1.0.0",
        title: 'Koolwijk app backend',
        description: 'The aim of the mobile app is to exchange pictures of incoming/outgoing goods with the colleagues in the office.',
    },
    host: 'https://koolwijk-backend.onrender.com',
    schemes: ['http', 'https'],
    tags: [
        {
            name: "Auth",
            description: "Endpoints"
        },
        {
            name: "Department",
            description: "Endpoints"
        },
        {
            name: "User",
            description: "Endpoints"
        },
        {
            name: "File",
            description: "Endpoints"
        }
    ],
    definitions: {
        User: {
            name: "Farid",
            email: "farid@gmail.com",
            password: "tester123",
            type: 'User',
            departmentId: 1
        },
        AddUser: {
            $name: "Farid",
            $email: "farid@gmail.com",
            $password: "tester123",
        },
        Department: {
            name: "Department 1",
        },
        AddDepartment: {
            $name: "Department 1"
        },
        File: {
            reference: "Ref 123",
            pictures: ["abc.jpg"],
            isDamaged: false
        },
        AddFile: {
            $reference: "Ref 123",
            $pictures: ["abc.jpg"],
        },
        FileImage: {
            url: "abc.jpg",
            fileId: 1
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js');
})