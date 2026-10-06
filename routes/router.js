const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/multer");

router.get("/", controller.homeGet);

router.get("/info", controller.infoGet);

router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", body('passwordConfirmation').custom((value, { req }) => {return value === req.body.password;}), controller.signUpPost);

router.get("/log-in", controller.logInGet);

router.get("/log-out", controller.logOutGet);

router.get("/upload", controller.uploadGet);
router.post("/upload", upload.single('myfile'), controller.uploadPost);

router.get("/add-folder", controller.addFolderGet);
router.post("/add-folder", controller.addFolderPost);

router.get("/folder/:folderId", controller.folderGet);
router.post("/folder/:folderId", controller.folderPost);

router.get("/folder/:folderId/update", controller.updateFolderGet);
router.post("/folder/:folderId/update", controller.updateFolderPost);

router.get("/folder/:folderId/file/:fileId", controller.fileGet);
router.post("/folder/:folderId/file/:fileId", controller.filePost);

router.get("/share/:link", controller.shareGet);

module.exports = router;
