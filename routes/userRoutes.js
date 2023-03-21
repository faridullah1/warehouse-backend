const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/createSuperAdmin').post(userController.createSuperAdmin);
router.route('/me').get(auth, userController.me);

router.use(auth, restrictTo('Super_Admin'));

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);
    
module.exports = router;