const express = require("express");
const { saveRoute, getSavedRoutes } = require("../handlers/routesHandler");
const { getRouteData } = require("../services/webScraper");
const { checkAuth } = require("../utils/checkAuth");
const router = express.Router();

/* POST route data. */
router.post("/", getRouteData);
router.use("/add", checkAuth);
router.post("/add", saveRoute);
router.use("/saved", checkAuth);
router.get("/saved", getSavedRoutes);

module.exports = router;
