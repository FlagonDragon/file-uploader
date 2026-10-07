const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const http = require('http');
const { body, validationResult, matchedData } = require("express-validator");

async function homeGet(req, res) {

    const users = await db.getUsers();

    const folders = await db.getFolders();

    const files = await db.getAllFiles();

    res.render("homeView", { users: users, files: files, folders: folders, user: req.user });

};

async function infoGet(req, res) {

    const users = await db.getUsers();

    const folders = await db.getFolders();

    const files = await db.getAllFiles();

    res.render("infoView", { users: users, files: files, folders: folders, user: req.user });

};

function signUpGet(req, res) {

    res.render("signUpView", { user: req.user });

};

const signUpPost = [
    validateUser = [body("username").trim().isLength({ max: 50 }).withMessage(`Username must be at most 50 characters`),
  body("password").trim().isLength({ max: 50 }).withMessage(`Password must be at most 50 characters`)],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render("signUpView", {errors: errors.array()});

        }

        const { username, password } = matchedData(req);

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.createUser(username, hashedPassword);

        res.redirect("/");

    }
];

function logInGet(req, res) {

    console.log(req.query);
    

    res.render("logInView", { user: req.user, from: req.query.from, folder: req.query.folder });

};

function logOutGet(req, res, next) {
//req.logout is passport function to end session
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });

};

function uploadGet(req, res) {

    const folderId = req.query.folder;

    // console.log('folderId (controllerGet): '+folderId);
    
    res.render("uploadView", { folderId: folderId, user: req.user });

};

const uploadPost = [
    validateUser = [body("filename").trim().isLength({ max: 50 }).withMessage(`Filename must be at most 50 characters`), body("folderId").trim()],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render("uploadView", {errors: errors.array()});

        }

        const { filename, folderId } = matchedData(req);

        //req.file to access file through multer middleware
        //filename and folderId are direct from form body

        const originalname = req.file.originalname

        const filepath = req.file.path

        const periodChar = filepath.indexOf(".");
        
        const filetype = filepath.slice(periodChar);

        const mimetype = req.file.mimetype;

        const filesize = req.file.size/1000+'MB';

        const uploadDate = new Date();

        const cloudUpload = await db.cloudinaryUpload(res, filepath);

        const fileUrl = cloudUpload.url;

        console.log(req.file);        
        console.log('filename: '+filename);
        console.log('originalname: '+originalname);
        console.log('fileUrl: '+fileUrl);
        console.log('filetype: '+filetype);
        console.log('mimetype: '+mimetype);
        console.log('filesize: '+filesize);
        console.log('uploadDate: '+uploadDate);
        console.log('folderId: '+folderId);
        
        await db.createFile(filename, originalname, fileUrl, filetype, mimetype, filesize, uploadDate, folderId);
        
        res.redirect(`/folder/${folderId}`);

    }
];

function addFolderGet(req, res) {

    res.render("addFolderView", { user: req.user });

};

const addFolderPost = [
    validateUser = [body("foldername").trim().isLength({ max: 50 }).withMessage(`Foldername must be at most 50 characters`)],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render("addFolderView", {errors: errors.array()});

        }

        const { foldername } = matchedData(req);

        await db.createFolder(foldername);

        res.redirect("/");

    }
];

async function folderGet(req, res) {

    const { folderId } = req.params;

    const folder = await db.getFolder(folderId);

    const files = await db.getFiles(folderId)

    res.render("folderView", { folder: folder, folderId: folderId, files:files, user: req.user });

};

async function folderPost(req, res) {

    const { linkDuration, folderId } = req.body;

    const uploadDate = new Date();

    const generatedUrl = db.makeid(20);

    console.log('url: '+generatedUrl);
    console.log('duration: '+linkDuration);
    console.log('folderId: '+folderId);
    console.log('uploadDate: '+uploadDate);

    await db.createLink(generatedUrl, uploadDate, linkDuration, folderId );

    res.send(`Temporary link: /share/${generatedUrl}`);

};

async function updateFolderGet(req, res) {

    const { folderId } = req.params;

    res.render("updateFolderView", { folderId: folderId, user: req.user });

};

const updateFolderPost = [
    validateUser = [body("folderId"), body("foldername").trim().isLength({ max: 50 }).withMessage(`Foldername must be at most 50 characters`), body("deleteData")],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render("updateFolderView", {errors: errors.array()});

        }

        const { folderId, foldername, deleteData } = matchedData(req);

        if (deleteData == 'yes') {

            await db.deleteFolder(folderId);

        } else if (deleteData == undefined) {

            await db.updateFolder(folderId, foldername);

        }

        res.redirect("/")

    }
];

async function fileGet(req, res) {

    const { folderId, fileId } = req.params;

    console.log(folderId, fileId);

    const file = await db.getFile(fileId) 

    res.render("fileView", { file: file, folderId: folderId, user: req.user });

};

const filePost = [
    validateUser = [body("filename"), body("fileUrl"), body("filetype"), body("fileId"), body("folderId"), body("deleteData")],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render("fileView", {errors: errors.array()});

        }

        const { filename, fileUrl, filetype, fileId, folderId, deleteData } = matchedData(req);

        if (deleteData == 'yes') {

            await db.deleteFile(fileId);

            res.redirect(`/folder/${folderId}`);

            return;

        } else if (deleteData == 'no') {  

            return;
        
        } else {

            // this is download button response
            console.log('DOWNLOADING...');
            console.log('download name: ');
            console.log(filename+filetype);
            console.log('fileUrl: ');
            console.log(fileUrl);

            // https.get is base function to get image from link.
            // Then res.set content disposition to "attachment" trigges asset download (rather than redirecting to it) and names it
            // Then .pipe works with .get to read from source and write to target

            http.get(`${fileUrl}`, function (file) {
                res.set('Content-disposition', 'attachment; filename=' + encodeURI(filename+filetype));
                file.pipe(res);
            });

            return;

        }

    }
];

async function shareGet(req, res) {

    const { link } = req.params;

    const dbLink = await db.getLink(link);

    console.log(dbLink);

    let currentDate = new Date();

    let milisecsTranscurred = currentDate - dbLink.uploadDate;

    let daysTranscurred = milisecsTranscurred/1000/60/60/24;

    if (daysTranscurred > dbLink.duration) {
        res.send('Link has expired');
        return;
    }

    res.redirect(`/folder/${dbLink.folderId}`);

};

module.exports = {
    homeGet,
    infoGet,
    signUpGet,
    signUpPost,
    logInGet,
    logOutGet,
    uploadGet,
    uploadPost,
    addFolderGet,
    addFolderPost,
    folderGet,
    folderPost,
    updateFolderGet,
    updateFolderPost,
    fileGet,
    filePost,
    shareGet
};