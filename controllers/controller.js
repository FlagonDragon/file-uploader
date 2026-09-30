const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");

async function homeGet(req, res) {

    const users = await db.getUsers();

    const folders = await db.getFolders();

    const files = await db.getAllFiles();

    // users.forEach(user => {
    //     console.log(user.username);
    // });

    console.log(files);

    res.render("homeView", { users: users, files: files, folders: folders, user: req.user });

};

async function infoGet(req, res) {

    const users = await db.getUsers();

    const folders = await db.getFolders();

    const files = await db.getAllFiles();

    // users.forEach(user => {
    //     console.log(user.username);
    // });

    console.log(files);

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

        // await db.insertUser(fullname, username, hashedPassword);

        await db.createUser(username, hashedPassword);

        res.redirect("/");

    }
];

function logInGet(req, res) {

    res.render("logInView", { user: req.user });

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

    console.log('folderId (controllerGet): '+folderId);
    
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
        //filename is direct from form body
    
        const filepath = req.file.path
        console.log(filepath);

        const periodChar = filepath.indexOf(".");
        
        const filetype = filepath.slice(periodChar);

        console.log('filename:'+filename);

        console.log('filepath:'+filetype);

        console.log('folderId (controllerPost): '+folderId);
        
        await db.createFile(filename, filepath, filetype, folderId);
        
        res.redirect("/");

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

    console.log(folderId);

    res.render("folderView", { folder: folder, folderId: folderId, files:files, user: req.user });

};

async function updateFolderGet(req, res) {

    const { folderId } = req.params;

    console.log(folderId);

    res.render("updateFolderView", { folderId: folderId, user: req.user });

};

const updateFolderPost = [
    validateUser = [body("folderId"), body("foldername").trim().isLength({ max: 50 }).withMessage(`Foldername must be at most 50 characters`), body("deleteData")],
    async (req, res) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {

            return res.status(400).render("addFolderView", {errors: errors.array()});

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
    updateFolderGet,
    updateFolderPost
};