const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/me').get(auth, fileController.me);
    
router.route('/')
    .get(auth, restrictTo('Super_Admin'), fileController.getAllFiles)
    .post(auth, fileController.uploadFilePictures, fileController.createFile);

router.route('/:id')
    .get(auth, fileController.getFile)
    .patch(auth, fileController.uploadFilePictures, fileController.updateFile)
    .delete(auth, restrictTo('Super_Admin'), fileController.deleteFile);
    
module.exports = router;