const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");

async function homeGet(req, res) {

    const users = await db.getUsers();

    const folders = await db.getFolders();

    users.forEach(user => {
        console.log(user.username);
    });

    console.log(users);

    // res.send('Homepage');

    res.render("homeView", { users: users, folders: folders });

};

async function infoGet(req, res) {

    const data = await db.getData();
    
    res.render("homeView", {data: data});

};

function signUpGet(req, res) {

    res.render("signUpView");

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

    res.render("uploadView", { user: req.user });

};

function uploadPost(req, res) {
    
    console.log(req.file);

    res.status(200).send("file uploaded");

};

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
    addFolderPost
};