const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");

function homeGet(req, res) {

    res.send('Homepage');

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

module.exports = {
    homeGet,
    infoGet,
    signUpGet,
    signUpPost,
    logInGet,
    logOutGet
};