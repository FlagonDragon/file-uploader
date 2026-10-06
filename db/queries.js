import { pool } from "./pool.js";
import { prisma } from "../lib/prisma.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cloudinary = require("../utils/cloudinary.js");

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

async function createFile(filename, originalname, fileUrl, filetype, mimetype, filesize, uploadDate, folderId) {

  const folderNum = Number(folderId);

  console.log(folderNum);
  
  const file = await prisma.file.create({
    data: {
      filename: filename,
      originalname: originalname,
      fileUrl: fileUrl,
      filetype: filetype,
      mimetype: mimetype,
      filesize: filesize,
      uploadDate: uploadDate,
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

async function deleteFile(fileId) {

  await prisma.file.delete({
    where: { id: Number(fileId) },
  });

}

function cloudinaryUpload(res, filepath) {

  return cloudinary.uploader.upload(filepath, function (err, result){

    if(err) {

      console.log(err);

      return res.status(500).json({
        success: false,
        message: "Error"
      })

    }

    return result;
    
  });
          
}

// Source - https://stackoverflow.com/a/1349426
// Posted by csharptest.net, modified by community. See post 'Timeline' for change history
// Retrieved 2026-10-06, License - CC BY-SA 4.0

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

async function createLink(url, uploadDate, duration, folderId) {

  const folderNum = Number(folderId);
  const durationNum = Number(duration);
  
  const link = await prisma.link.create({
    data: {
      url: url,
      uploadDate: uploadDate,
      duration: durationNum,
      folderId: folderNum,
    },
  });

  console.log("Created link:", link);
  
}

async function getLink(url) {

  const link = await prisma.link.findUnique({
    where: { url: url },
  });

  return link;
  
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
  deleteFolder,
  deleteFile,
  cloudinaryUpload,
  makeid,
  createLink,
  getLink
}

