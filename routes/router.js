const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { body, validationResult } = require("express-validator");

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.get("/", controller.homeGet);

router.get("/info", controller.infoGet);

router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", body('passwordConfirmation').custom((value, { req }) => {return value === req.body.password;}), controller.signUpPost);

router.get("/log-in", controller.logInGet);

router.get("/log-out", controller.logOutGet);

router.get("/upload", controller.uploadGet);
router.post("/upload", upload.single('myfile'), controller.uploadPost);



module.exports = router;
