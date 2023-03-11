const express = require('express');
const router = express.Router();

const fileController = require('../controllers/fileController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/')
    .get(auth, fileController.getAllFiles)
    .post(auth, restrictTo('Warehouse_Personnel'), fileController.uploadFilePictures, fileController.createFile);

router.route('/:id')
    .delete(auth, restrictTo('Warehouse_Personnel'), fileController.deleteFile);
    
module.exports = router;