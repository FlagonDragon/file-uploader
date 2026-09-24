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

async function createUser() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
      name: "testUser",
      email: "testUser@prisma.io",
      posts: {
        create: {
          title: "Hello World",
          content: "This is my first post!",
          published: true,
        },
      },
    },
    include: {
      posts: true,
    },
  });
  console.log("Created user:", user);

  // Fetch all users with their posts
  const allUsers = await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
  console.log("All users:", JSON.stringify(allUsers, null, 2));
}

export {getData, insertUser, createUser}

