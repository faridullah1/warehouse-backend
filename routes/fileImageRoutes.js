const express = require('express');
const router = express.Router();

const fileImageController = require('../controllers/fileImageController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/')
    .get(auth, restrictTo('Admin'), fileImageController.getAllFileImages)

router.route('/:id')
    .delete(auth, restrictTo('Admin'), fileImageController.deleteFileImage)

module.exports = router;