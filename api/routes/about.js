var express = require("express");
var router = express.Router();
var aboutController = require('../controllers/about');

router.get("/about", aboutController.about_get_all);

router.post("/about", aboutController.about_post_all);

module.exports = router;
