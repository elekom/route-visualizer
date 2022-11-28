var express = require('express');
var router = express.Router();

const { userTags, tagLocations } = require('../handlers/usersHandler');
const { checkAuth } = require('../utils/checkAuth');

router.use('/', checkAuth);
router.get('/', userTags);
router.get('/:tagId/locations', tagLocations);
router.post('/locations', tagLocations);
module.exports = router;