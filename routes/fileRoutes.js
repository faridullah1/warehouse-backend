const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/me').get(auth, fileController.me);
    
router.route('/')
    .get(auth, restrictTo('Super_Admin'), fileController.getAllFiles)
    .post(auth, restrictTo('Warehouse_Personnel'), fileController.uploadFilePictures, fileController.createFile);

router.route('/:id')
    .patch(auth, restrictTo('Warehouse_Personnel'), fileController.uploadFilePictures, fileController.updateFile)
    .delete(auth, restrictTo('Super_Admin'), fileController.deleteFile);
    
module.exports = router;