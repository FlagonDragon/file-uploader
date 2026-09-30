import { pool } from "./pool.js";
import { prisma } from "../lib/prisma.js";


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

async function getUsers() {

  const users = await prisma.user.findMany();

  return users;
  
}

async function createFile(filename, filepath, filetype, folderId) {

  const folderNum = Number(folderId)

  console.log(folderNum);
  

  const file = await prisma.file.create({
    data: {
      filename: filename,
      filepath: filepath,
      filetype: filetype,
      folderId: folderNum,
    },
  });

  console.log("Created file:", file);
  
}

async function getFile(fileId) {

  const file = await prisma.file.findUnique({
    where: { id: Number(fileId) },
  });

  return file;
  
}

async function getFiles(folderId) {

  const files = await prisma.file.findMany({
    where: { folderId: Number(folderId) },
  });

  return files;
  
}

async function getAllFiles() {

  const files = await prisma.file.findMany();

  return files;
  
}

async function createFolder(foldername) {

  const folder = await prisma.folder.create({
    data: {
      foldername: `${foldername}`,
    },
  });

  console.log("Created folder:", folder);
  
}

async function getFolder(folderId) {

  const folder = await prisma.folder.findUnique({
    where: { id: Number(folderId) }
  });

  return folder;
  
}

async function getFolders() {

  const folders = await prisma.folder.findMany();

  return folders;
  
}

async function updateFolder(folderId, foldername) {

  await prisma.folder.update({
    where: { id: Number(folderId) },
    data: { foldername: foldername }
  });

}

async function deleteFolder(folderId) {

  await prisma.folder.delete({
    where: { id: Number(folderId) },
  });

}

export {
  insertUser, 
  createUser,
  getUsers,
  createFile,
  getFile,
  getFiles,
  getAllFiles,
  createFolder,
  getFolder,
  getFolders,
  updateFolder,
  deleteFolder
}

