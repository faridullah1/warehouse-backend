const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');

router.route('/')
    .get(auth, userController.getAllUsers)
    .post(userController.createUser);
    
module.exports = router;