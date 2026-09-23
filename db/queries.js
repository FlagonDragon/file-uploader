const pool = require("./pool");

async function getData() {

  const { rows } = await pool.query("SELECT * FROM mytable");

  return rows;

};



module.exports = { 
  getData 
};

