const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { body, validationResult } = require("express-validator");

const multer  = require('multer')

// Source - https://stackoverflow.com/a/40988346
// Posted by VISHNU
// Retrieved 2026-09-26, License - CC BY-SA 3.0

// diskstorage function is used to customize file name so that it's composed of field name + file extension

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
  }
})

const upload = multer({ storage: storage })

router.get("/", controller.homeGet);

router.get("/info", controller.infoGet);

router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", body('passwordConfirmation').custom((value, { req }) => {return value === req.body.password;}), controller.signUpPost);

router.get("/log-in", controller.logInGet);

router.get("/log-out", controller.logOutGet);

router.get("/upload", controller.uploadGet);
router.post("/upload", upload.single('myfile'), controller.uploadPost);



module.exports = router;
