const express = require("express");
const router = express.Router();

const {addLocations, addMultipleLocations} = require("../handlers/geolocationsHandler");

router.post("/", addLocations);
router.post("/add", addMultipleLocations);
module.exports = router;
