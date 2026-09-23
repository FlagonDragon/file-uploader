const db = require("../db/queries");

function homeGet(req, res) {

    res.send('Homepage');

};

async function infoGet(req, res) {

    const data = await db.getData();
    
    res.render("homeView", {data: data});

};



module.exports = {
    homeGet,
    infoGet
};