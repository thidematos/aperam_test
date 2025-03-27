const express = require('express');
const talhaoController = require('./../controllers/talhaoController');

const router = express.Router();

router.route('/').get(talhaoController.getTalhoes);

module.exports = router;
