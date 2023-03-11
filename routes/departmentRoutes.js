const express = require('express');
const router = express.Router();

const departmentController = require('../controllers/departmentsController');

router.route('/')
    .get(departmentController.getAllDepartments)
    .post(departmentController.createDepartment);

router.route('/:id')
    .delete(departmentController.deleteDepartment)
    
module.exports = router;