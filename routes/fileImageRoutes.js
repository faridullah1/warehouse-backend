const express = require('express');
const router = express.Router();

const fileImageController = require('../controllers/fileImageController');
const { auth } = require('../middlewares/auth');
const { restrictTo } = require('../middlewares/permissions');

router.route('/')
    .get(auth, restrictTo('Super_Admin'), fileImageController.getAllFileImages)

module.exports = router;