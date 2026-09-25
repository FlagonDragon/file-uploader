import { pool } from "./pool.js";
import { prisma } from "../lib/prisma.js";


async function getData() {

  const { rows } = await pool.query("SELECT * FROM mytable");

  return rows;

};

async function insertUser(fullname, username, password) {

  await pool.query(`INSERT INTO userbase (fullname, username, password, membership)
  VALUES 
    ('${fullname}', '${username}', '${password}', 'no');
  `);

};

async function createUser(username, password) {

  const user = await prisma.user.create({
    data: {
      username: `${username}`,
      password: `${password}`,
    },
  });

  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany();

  console.log("All users:", JSON.stringify(allUsers, null, 2));
  
}

export {getData, insertUser, createUser}

