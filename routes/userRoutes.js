const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/')
    .get(auth, userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .delete(auth, restrictTo('Super_Admin'), userController.deleteUser);
    
module.exports = router;