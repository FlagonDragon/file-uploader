const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();

router.get("/", controller.homeGet);

router.get("/info", controller.infoGet);



module.exports = router;
