require("dotenv").config();
const express = require("express");
const router = express.Router();
const FILE = require("../models/file");
const FOLDER = require("../models/folder");
const { User } = require("../models/users");
const multer = require("multer");
var AWS = require("aws-sdk");
const ObjectId = require('mongoose').Types.ObjectId;
const Path = require('path');
var https = require('https');
const fs = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, Path.join(__dirname, '/uploads/'));
   },
  filename: function (req, file, cb) {
      cb(null , file.originalname);
  }
});

var upload = multer({storage:storage});

const { ObjectID } = require("bson");
const file = require("../models/file");
const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});
const s3FileURL = process.env.AWS_Uploaded_File_URL_Link;

// API to upload a folder.
router.post('/folder/upload', upload.single('folder'),async(req, res, next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for uploading a folder.'
  var newFolderUploaded = {
    Name: req.body.folderName,
    users: [req.body.users], 
    viewers:[req.body.users],
    creator: req.body.users
  }
  // creating instance of folder with params.
  var document = new FOLDER(newFolderUploaded);
  document.save((err, docs)=>{
    if(err){
      console.log(err);
      res.status(500).send(err);
    }
    else{
      res.status(200).send(docs);
    }
  });
});

// API to get the folders.
router.get('/folder/get/:id', async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for viewing folders.'
  FOLDER.find(
    {
      'creator':ObjectId(req.params.id),
      'isIndependant':true 
    },
    null,
    {
      sort: { createdAt: 1 }
    },
    (err, docs) => {
      if (err) {
        return next(err);
      }
      next(res.status(200).send(docs));
    }
  );
});

// API to favourite a folder.
router.patch('/folder/favourite/:folderIDuserID', async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for adding folder to favourites.'
  let folderID = req.params.folderIDuserID.split(',')[0];
  let userID = req.params.folderIDuserID.split(',')[1];
  FOLDER.findOne({ _id:folderID, users: userID}, function(err, docs) {
    docs.favourite = !(docs.favourite);
    docs.save(function(err, updatedDoc) {
      if(!err)res.status(200).send(updatedDoc)
      else res.status(500).send(err);
    }); 
  });
});

// API to rename the folders. 
router.patch('/folder/rename/:folderIDnewNameUserID', async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for renaming a folder.'
  let folderID = req.params.folderIDnewNameUserID.split(',')[0];
  let newName = req.params.folderIDnewNameUserID.split(',')[1];
  let userID = req.params.folderIDnewNameUserID.split(',')[2];
  // mongodb function to find and update the folder.
  FOLDER.findOneAndUpdate({'_id':ObjectId(folderID), 'users':userID}, {'Name': newName}, {
    new: true
  },(errorinRenaming, renamedDoc)=>{
    if(errorinRenaming){
      next(res.status(500).send(errorinRenaming));
    }
    else{
      console.log(renamedDoc);
      next(res.status(200).send(renamedDoc));
    }
  })
});

// API to share folder permissions. 
router.patch('/folder/addUser/:accessFolderIDmailAddedUserID',async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint to share folder permissions. 
  access = req.params.accessFolderIDmailAddedUserID.split(',')[0]
  folderID = req.params.accessFolderIDmailAddedUserID.split(',')[1];
  mailAdded = req.params.accessFolderIDmailAddedUserID.split(',')[2];
  userID = req.params.accessFolderIDmailAddedUserID.split(',')[3];
  // Mongodb function to find if user exists.
  await User.findOne({'email':mailAdded}, async(errorInUser, foundDoc)=>{
    if(errorInUser){
      next(res.status(400).send(errorInUser));
    }
    else if(!foundDoc){
      next(res.status(400).send("can't find user"))
    }
    else{
      // If user exists, check for persmission
      if(access=="All"){  
        await FOLDER.findOneAndUpdate({'_id':ObjectId(folderID),'users':userID,'users': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: {viewers: foundDoc["_id"] }}, async(errorInUpdatingUser, userDocs)=>{
          if(userDocs==null){
            next(res.status(500)).send("The user can't be added by you");
          }
          else if(!errorInUpdatingUser){
            await FILE.find({'parentFolder': userDocs["_id"], 'users':userID, 'users': { $ne: ObjectId(foundDoc["_id"]) }},(errorInUpdatingFilesWithinFolder, filesWithinFolder)=>{
              if(errorInUpdatingFilesWithinFolder){
                next(res.status(500).send("Couldn't update files within folder"))
              }
              else if(filesWithinFolder.length){
                filesWithinFolder.forEach((fileWithinFolder)=>{
                  fileWithinFolder["users"].push(foundDoc["_id"]);
                  fileWithinFolder.save();
                })
                next(res.status(200).send(filesWithinFolder));
              }
              else{
                next(res.status(400).send("No files within folder"))
              }
            });
          }
          else{
            next(res.status(500).send(errorInUpdatingUser))
          }
        });
      }
      if(access=="View"){
        await FOLDER.findOneAndUpdate({'_id':ObjectId(folderID),'users':userID,'viewers': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: {viewers: foundDoc["_id"] }}, async(errorInUpdatingViewer, viewerDocs)=>{
          if(viewerDocs==null){
            next(res.status(400).send("The user can't be added by you"))
          }
          else if(!errorInUpdatingViewer){
            await FILE.find({'parentFolder': viewerDocs["_id"], 'users':userID, 'viewers': { $ne: ObjectId(foundDoc["_id"]) }},async(errorInUpdatingFilesWithinFolder, filesWithinFolder)=>{
              if(errorInUpdatingFilesWithinFolder){
                next(res.status(500).send("Couldn't update files within folder"))
              }
              else if(filesWithinFolder.length){
                filesWithinFolder.forEach((fileWithinFolder)=>{
                  fileWithinFolder["viewers"].push(foundDoc["_id"]);
                  fileWithinFolder.save();
                })
                next(res.status(200).send(filesWithinFolder));
              }
              else{
                next(res.status(400).send("No files within folder"))
              }
            });
          }
          else{
            next(res.status(500).send(errorInUpdatingViewer))
          }
        })
      }
    }
  })
});

// API to delete folder.
router.delete('/folder/delete/:folderIDuserID', async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for deleting a folder.'
  let folderID = req.params.folderIDuserID.split(',')[0];
  let userID = req.params.folderIDuserID.split(',')[1];
  // Mongodb function to find folder
  FILE.find({parentFolder: ObjectId(folderID), users: ObjectId(userID)},(err,docs)=>{
    if(!err){
      console.log("Going to delete them from s3 bucket");
      docs.forEach((doc)=>{
        var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: doc["_id"].toString() };
        // Deleting from the AWS s3 bucket.
        s3bucket.deleteObject(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);  
            next(res.status(500).send(err));
          }
        })
      })
    }
    else{
      throw err;
    }
  });
  // Mongodb function to delete metadata of folder.
  FILE.deleteMany({ parentFolder: ObjectId(folderID), users: ObjectId(userID)}, (err, docs)=>{
    if(!err)
    {
      FOLDER.findByIdAndDelete(ObjectId(folderID), (error, deleteddoc)=>{
        if(!err){
          next(res.status(200).send(deleteddoc));
        }
        else{
          next(res.status(500).send(error));
        }
      })
    }
    else{
      next(res.status(500).send(err));
    }
  }); 
});

// API to post file in folder.
router.post('/folder/uploadFile', upload.single('file'), async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for uploading a file in folder.'
  const file = req.file;
  const folderID = req.body.folderID;
  console.log(file);
  // Storing the params data in a var.
  var newFileUploaded = {
    description: req.body.description,
    s3_key: file.originalname,
    users: [req.body.users],
    viewers: [req.body.users],
    creator: req.body.users,
    parentFolder: folderID,
    isIndependant: false,
    type: file.originalname.split('.').pop(),
    size:file.size
  }
  // Reading and checking if file is present in fs.
  fs.readFile(file.path, (error, fileContent)=>{
    if(error){
      console.log("error in fs");
      res.status(500).send("Hmm, looks like there is something wrong with the code");
    }
    else if(!error){
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Body: fileContent,
        ContentType: file.mimetype,
      };
      // Creating an instance of file.
      var document = new FILE(newFileUploaded);
      document.save(function(filesaveerror, newFile) {
        if(!filesaveerror){
          console.log(newFile); 
          // Function to save file in folder in AWS
          FOLDER.findByIdAndUpdate(folderID,{  $push: { files: newFile._id }}, function(errorinfolder, docs){
            if(!errorinfolder){
              docs["size"]+= newFile["size"]
              docs.save();
              params.Key = newFile["_id"].toString();
              s3bucket.putObject(params, async function(s3err, data) {
                if (s3err) {
                  await next(res.status(500).json({ error: true, Message: s3err }));
                } 
                else{
                  await unlinkAsync(req.file.path)
                  await next(res.status(200).send(docs));
                }});
            }
            else
            next(res.status(500).send(errorinfolder));
          });
        }
        if (filesaveerror) {
          next(res.status(500).send(filesaveerror))
        }
      });
    }
  });
})

// API to display the files within folders. 
router.get(`/folder/getFiles/:dets`, async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for viewing files inside Folder.'
  let folderId = req.params.dets.split(',')[0]
  let userId = req.params.dets.split(',')[1];
  //Mongodb function to find the FileID.
  FILE.find({
    'creator':ObjectId(userId),
    'parentFolder': folderId
    },
    null,
    {
      sort: { createdAt: 1 }
    },
    (err, docs) => {
      if (err) {
      res.status(500).send(err);
      }  
      console.log(docs);
      res.status(200).send(docs);
    }
  );
});

// API to delete the files in a folder from AWS and clear metadata info from the mongo db.
router.delete(`/folder/deletefile/:dets`, async(req,res,next)=>{
  // #swagger.tags = ['Folder']
  // #swagger.description = 'Endpoint used for deleting files in folders.'

  // Getting necessary id info from params for manipulation.
  let fileId =  req.params.dets.split('&')[0]
  let userId = req.params.dets.split('&')[1];
  let folderID = req.params.dets.split('&')[2];
  // Calling monogodb function to find folder by id.  
  FOLDER.findByIdAndUpdate(folderID, { $pullAll: {files:[ObjectId(fileId)]} },(err, docs)=>{
    if(err){
        // if ID doesn't exist, return error.
        res.status(500).send(err);
        console.log(err);
    }
    else{
      // Calling mongodb function to find file in the folder by id.
      FILE.findById(fileId, (errorinfindingfile, doc)=>{
        if(!errorinfindingfile){
          var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: fileId };
          // Deleting files in the s3 storage using aws credentials
          s3bucket.deleteObject(params, function(err, data) {
            if (err) {
              console.log(err, err.stack);  
              next(res.status(500).send(err));
            }
          })
        }
        else{
          // File Id not found error. 
          next(res.status(500).send(errorinfindingfile)) 
        }
      })
      // Calling function to delete the file meta data from the mongodb storage.
      FILE.findOneAndDelete({'_id':ObjectId(fileId), 'users':ObjectId(userId)},(error, documents)=>{
        if(error)
        res.status(500).send(error);
        else
        res.status(200).send(documents);
      })
    }
  })
})

// --------------------------------------------------- FILES ---------------------------------------------------------------------------------------

// API to post file in S3.
router.post('/file/upload', upload.single("file"), async(req,res,next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for uploading a file.'
  const file = req.file;
  // Saving params as instance var.       
  var newFileUploaded = {
    description: req.body.description,
    s3_key: file.originalname,
    users: [req.body.users],
    viewers: [req.body.users],
    creator: req.body.users,
    size: file.size,
    type: file.originalname.split('.').pop()
  }

  await fs.readFile(file.path, async(error, fileContent)=>{
    if(error){
      await next(res.status(500).send("The file can't be uploaded"))
    }
    if(!error){
      var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileContent,
      ContentType: file.mimetype,
      }
      // Saving instance.
      var document = new FILE(newFileUploaded);
      await document.save(async function(error, newFile){
        if(!error){
          await console.log(newFile);
          params.Key=newFile["_id"].toString();
          // Saving in s3.
          await s3bucket.putObject(params, async function(err, data) {
            if (err) {
              await console.log(err);
              await next(res.status(500).json({ error: true, Message: err }));
            } 
            else{
              await unlinkAsync(req.file.path) 
              await next(res.status(200).send(newFile)) 
            }
          });
        }
        if (error) {
          res.status(500).send("File couldn't be saved")
        }
      });
    }
  });
})

// API to view files.
router.get('/file/get/:id', async(req,res,next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for viewing File.'
  // Mongodb function to find file.
  FILE.find({
      // Checking if file is uploaded by user or shared to user.
      'creator':ObjectId(req.params.id),
      'isIndependant':true
    },
    null,
    {
      sort: { createdAt: 1 }
    },
    (err, docs) => {
      if(err){
        next(res.status(500).send(err));
      }  
      else{
        next(res.status(200).send(docs));
      }
    }
  );
});

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close(cb); 
       // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};

router.get('/file/download/:fileNameUserID', async(req,res, next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for downloading files from AWS bucket ( using presigned url ).'
  fileName = req.params.fileNameUserID.split(',')[0].toString();
  userID = req.params.fileNameUserID.split(',')[1].toString();
  
  if(fileName.length>0)
   {
     FILE.findOne({"_id":ObjectId(fileName),
    $or:[ 
      {'users':ObjectId(userID)},
     
    ]},
    async(errorInFindingFile, doc)=>{
      if(errorInFindingFile){
        await next(res.status(500).send("You can't view the file"));
      }
      else if(doc==null){
        await next(res.status(403).send("You can't view the file"))
      }
      // Get a presigned url from AWS to view the files. 
      else{
        const params = {
          Bucket: 'files-vicara-drive',
          Key: doc["_id"].toString(),
          Expires: 60 * 5
        };
        try{
          const url = await new Promise(async (resolve, reject) => {
            await s3bucket.getSignedUrl('getObject', params, async(err, url) => {
              await err ? reject(err) : resolve(url);
              download(url,Path.join(__dirname, '/uploads/', (doc["_id"].toString()).concat('.').concat(doc["s3_key"].split('.').pop()).toString()),(file)=>{
               
                res.setHeader('Content-disposition', 'attachment');
                res.download(Path.join(__dirname, '/uploads/', (doc["_id"].toString()).concat('.').concat(doc["s3_key"].split('.').pop()).toString()), doc["s3_key"],(()=>{
                 unlinkAsync(Path.join(__dirname, '/uploads/',(doc["_id"].toString()).concat('.').concat(doc["s3_key"].split('.').pop()).toString()));
                }))
              })
            });
          });
          
       
            
           

          
        }catch (err) {
          if (err) {
            await next(res.status(500).send(err));
          }
        }
      }
    })
  }
  else{
    res.status(500).send("no file");
  }
});
// API to view the files from the AWS bucket.
router.get('/file/getPresignedUrl/:fileNameUserID', async(req,res, next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for viewing files from AWS bucket ( presigned url ).'
  fileName = req.params.fileNameUserID.split(',')[0].toString();
  userID = req.params.fileNameUserID.split(',')[1].toString();
  
  if(fileName.length>0)
   {
     FILE.findOne({"_id":ObjectId(fileName),
    $or:[ 
      {'users':ObjectId(userID)},
      {'viewers':ObjectId(userID)} 
    ]},
    async(errorInFindingFile, doc)=>{
      if(errorInFindingFile){
        await next(res.status(500).send("You can't view the file"));
      }
      else if(doc==null){
        await next(res.status(403).send("You can't view the file"))
      }
      // Get a presigned url from AWS to view the files. 
      else{
        const params = {
          Bucket: 'files-vicara-drive',
          Key: doc["_id"].toString(),
          Expires: 60 * 5
        };
        try{
          const url = await new Promise(async (resolve, reject) => {
            await s3bucket.getSignedUrl('getObject', params, async(err, url) => {
              await err ? reject(err) : resolve(url);
            });
          });
          await next(res.status(200).send(url));
        }catch (err) {
          if (err) {
            await next(res.status(500).send(err));
          }
        }
      }
    })
  }
  else{
    res.status(500).send("no file");
  }
});





// API to rename the files. 
router.patch('/file/rename/:fileIDnewNameUserID', async(req,res, next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for renaming a file.'
  let fileID = req.params.fileIDnewNameUserID.split(',')[0];
  let newName = req.params.fileIDnewNameUserID.split(',')[1];
  let userID = req.params.fileIDnewNameUserID.split(',')[2];
  // mongodb function to find and update the file.
  FILE.findOneAndUpdate({'_id':ObjectId(fileID), 'users':userID}, {'s3_key': newName}, {
    new: true
  },(errorinRenaming, renamedDoc)=>{
    if(errorinRenaming){
      next(res.status(500).send(errorinRenaming));
    }
    else if(renamedDoc==null){
      next(res.status(403).send("The file is not allowed to be renamed by you"))
    }
    else{
      next(res.status(200).send(renamedDoc));
    }
  })
})

// API to share file permissions. 
router.patch('/file/addUser/:accessFileIDmailAddedUserID', async(req,res,next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for sharing files.'
  access = req.params.accessFileIDmailAddedUserID.split(',')[0]
  fileID = req.params.accessFileIDmailAddedUserID.split(',')[1];
  mailAdded = req.params.accessFileIDmailAddedUserID.split(',')[2];
  userID = req.params.accessFileIDmailAddedUserID.split(',')[3];
  // Mongodb function to check if requested user exists.
  await User.findOne({'email':mailAdded}, async(errorInUser, foundDoc)=>{
    if(errorInUser){
      next(res.status(400).send(errorInUser)); 
    }
    else if(!foundDoc){
      next(res.status(400).send("can't find user"))
    }
    // If user is present, give permission accordingly.
    else{
      if(access=="All"){
        // Checking pre-conditions before pushing new user to array 
        await FILE.findOneAndUpdate({'_id':ObjectId(fileID),'users':userID,  'users': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: { users: foundDoc["_id"] }}, (errorInUpdatingUser, docs)=>{
          if(docs==null){
            next(res.status(400).send("The user can't be added by you"))
          }
          else if(!errorInUpdatingUser){
                next(res.status(200).send(docs));
          }
          else{
            next(res.status(500).send(errorInUpdatingUser))
          }
        })
      }
      if(access=="View"){
        // Checking pre-conditions before pushing new user to array 
        await FILE.findOneAndUpdate({'_id':ObjectId(fileID),'users':userID, 'viewers': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: {viewers: foundDoc["_id"] }}, (errorInUpdatingViewer, viewerDocs)=>{
          if(viewerDocs==null){
            next(res.status(400).send("The user can't be added by you"))
          }
          else if(!errorInUpdatingViewer){
            next(res.status(200).send(viewerDocs));
          }
          else{
            next(res.status(500).send(errorInUpdatingViewer))
          }
        })
      }
    }
  })
});

// API to favourite a file.
router.patch('/file/favourite/:fileIDuserID', async(req,res,next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for adding file to favourites.'
  let fileID = req.params.fileIDuserID.split(',')[0];
  let userID = req.params.fileIDuserID.split(',')[1];

  FILE.findOne({ _id:ObjectId(fileID.toString()),users:ObjectId(userID.toString())}, function(err, docs) {
    if(err){
      res.status(500).send("I can't find the file");
    }
    else if(docs!=null){ 
      docs.favourite = !(docs.favourite);
      docs.save(function(err, updatedDoc) {
        if(!err){
          res.status(200).send(updatedDoc)
        }
        else{
          res.status(500).send(err);
        }
      }); 
    }
    else{
      res.status(400).send("The file cannot be made a favourite for you")
    }
  });
});

// API to get a shared File.
router.get('/file/shareView/:id', async(req,res,next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for viewing a shared file.'
  const userID = req.params.id.toString();
  // MongoDb function to retrieve the shared files.
  FILE.find({$or:[{'users':ObjectId(userID)},{'viewers':ObjectId(userID)}], 'creator': { $ne: ObjectId(userID) } }).lean().exec((errorInFindingFiles, files)=>{
    if(!errorInFindingFiles){
      filesToBeSent =[];
      for(var [i,file] of files.entries()){ 
           User.findById(file["creator"],async(errorInFindingCreator,creatorDets)=>{
               if(!errorInFindingCreator){
                 file.creator= creatorDets["name"]
                 filesToBeSent.push(file)
               } 
           }).then(()=>{
            if(i==(files.length-1)){
              console.log(filesToBeSent)
              res.status(200).send(filesToBeSent);
            }
           })  
          }
    }
    else{
      next(res.status(500).send("Couldn't retrieve shared files"))
    }
  })
})

// API to delete file.
router.delete('/file/delete/:fileIDuserID', async(req,res,next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint used for deleting a File.'
  let fileID = req.params.fileIDuserID.split(',')[0].toString();
  let userID = req.params.fileIDuserID.split(',')[1].toString();
  // Mongodbd function to find  and delete file.
  FILE.findOneAndDelete({ _id: ObjectId(fileID), users: ObjectId(userID)}, (err,docs)=>{
    if(err){
      return next(err);
    }
    else if(docs==null){
      return res.status(403).send("You don't have access to delete the file or file ID is wrong")
    }
    else if(docs!=null){
      var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: fileID };
      s3bucket.deleteObject(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);  
          res.status(500).send(err);
        }// error
        else{
          res.status(200).send(docs);
        }                 // deleted
      });
    }
  });
});

// API to remove access to a file.
router.patch('/file/removeUser/:fileIDuserID', async(req, res, next)=>{
  // #swagger.tags = ['File']
  // #swagger.description = 'Endpoint removing access to a file.'
  let fileID = req.params.fileIDuserID.split(',')[0];
  let userID = req.params.fileIDuserID.split(',')[1];

  FILE.findOneAndUpdate({"_id":fileID, $or:[{'viewers': userID},{'users':userID}]},{ $pullAll: {users:[ObjectId(userID)]}, $pullAll: {viewers:[ObjectId(userID)]} }, async(errorInUpdatingAccess, docs)=>{
    if(!errorInUpdatingAccess){
      next(res.status(200).send(docs))
    }
    else{
      next(res.status(500).send("Could not update Access"))
    }
  })
});


module.exports = router;



