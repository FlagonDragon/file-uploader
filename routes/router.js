const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const { body, validationResult } = require("express-validator");
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");

router.get("/", controller.homeGet);

router.get("/info", controller.infoGet);

router.get("/sign-up", controller.signUpGet);
router.post("/sign-up", body('passwordConfirmation').custom((value, { req }) => {return value === req.body.password;}), controller.signUpPost);

router.get("/log-in", controller.logInGet);

router.get("/log-out", controller.logOutGet);

router.get("/upload", controller.uploadGet);
router.post("/upload", controller.uploadPost);
// router.post("/upload", upload.single('myfile'), function (req, res) {
//   console.log(req.file);
//   cloudinary.uploader.upload(req.file.path, function (err, result){
//     if(err) {
//       console.log(err);
//       return res.status(500).json({
//         success: false,
//         message: "Error"
//       })
//     }

//     res.status(200).json({
//       success: true,
//       message:"Uploaded!",
//       data: result
//     })
//   })
// });

router.get("/add-folder", controller.addFolderGet);
router.post("/add-folder", controller.addFolderPost);

router.get("/folder/:folderId", controller.folderGet);

router.get("/folder/:folderId/update", controller.updateFolderGet);
router.post("/folder/:folderId/update", controller.updateFolderPost);

router.get("/folder/:folderId/file/:fileId", controller.fileGet);
router.post("/folder/:folderId/file/:fileId", controller.filePost);

module.exports = router;
