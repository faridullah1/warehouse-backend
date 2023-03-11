const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/departments');

router.route('/')
    .get(departmentController.getAllDepartments)
    .post(departmentController.createDepartment);

router.route('/:id')
    .delete(departmentController.deleteDepartment)
    
module.exports = router;