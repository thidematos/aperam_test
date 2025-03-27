const express = require('express');
const authController = require('./../controllers/authController');
const dummyController = require('./../controllers/dummyController');

const router = express.Router();

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').get(dummyController.getDummy);

module.exports = router;
