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
const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4'
});
const s3FileURL = process.env.AWS_Uploaded_File_URL_Link;




router.delete(`/fileInFolder/:dets`, async(req,res,next)=>{
  let fileId =  req.params.dets.split('&')[0]
  let userId = req.params.dets.split('&')[1];
  let folderID = req.params.dets.split('&')[2];


FOLDER.findByIdAndUpdate(folderID, { $pullAll: {files:[ObjectId(fileId)]} },(err, docs)=>{
  if(err)
    {
      res.status(500).send(err);
      console.log(err);
    }
    else
    {
      
      console.log(docs);
      FILE.findById(fileId, (errorinfindingfile, doc)=>{
        if(!errorinfindingfile){
          var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: fileId };
          s3bucket.deleteObject(params, function(err, data) {
            if (err) {
              console.log(err, err.stack);  
              next(res.status(500).send(err));
            }// error
                           // deleted
          })
        }
        else
        next(res.status(500).send(errorinfindingfile))
      })
      FILE.findOneAndDelete({'_id':ObjectId(fileId), 'users':ObjectId(userId)},(error, documents)=>{
        if(error)
        res.status(500).send(error);
        else
        res.status(200).send(documents);
      })
    }
})
})

router.get(`/displayfileswithinfolder/:dets`, async(req,res,next)=>{
 
 

let folderId = req.params.dets.split(',')[0]
let userId = req.params.dets.split(',')[1];


FILE.find(       
  {
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

router.get('/url/:fileNameUserID', async(req,res, next)=>{
  fileName = req.params.fileNameUserID.split(',')[0].toString();
  userID = req.params.fileNameUserID.split(',')[1].toString();
  console.log(fileName);
  console.log(userID);
  if(fileName.length>0)
   {
     FILE.findOne({"_id":ObjectId(fileName),
    $or:[ 
    {'users':ObjectId(userID)},
     {'viewers':ObjectId(userID)} 
   ]},async(errorInFindingFile, doc)=>{
      if(errorInFindingFile)
      {
        await next(res.status(500).send("You can't view the file"));

      }
      else if(doc==null)
      {
        await next(res.status(403).send("You can't view the file"))
      }
      else
      {
        const params = {
          Bucket: 'files-vicara-drive',
          Key: doc["_id"].toString(),
          Expires: 60 * 5
        };
       try {
          const url = await new Promise(async (resolve, reject) => {
            await s3bucket.getSignedUrl('getObject', params, async(err, url) => {
             await err ? reject(err) : resolve(url);
            });
          });
          await console.log(url);
          
         await next(res.status(200).send(url));
       
        } catch (err) {
          if (err) {
            await console.log(err);
            await next(res.status(500).send(err));
          }
        }
      }
   })

  }
  else
  {
    res.status(500).send("no file");
  }
 
});

router.get('/folder/:id', async(req,res,next)=>{
  console.log(req.params.id);
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

router.patch('/renameFolder/:folderIDnewNameUserID', async(req,res,next)=>{
let folderID = req.params.folderIDnewNameUserID.split(',')[0];
let newName = req.params.folderIDnewNameUserID.split(',')[1];
let userID = req.params.folderIDnewNameUserID.split(',')[2];

FOLDER.findOneAndUpdate({'_id':ObjectId(folderID), 'users':userID}, {'Name': newName}, {
  new: true
}, (errorinRenaming, renamedDoc)=>{
  if(errorinRenaming)
  next(res.status(500).send(errorinRenaming));

  else
  {
    console.log(renamedDoc);
  next(res.status(200).send(renamedDoc));
  }
})
});

router.patch('/renameFile/:fileIDnewNameUserID', async(req,res, next)=>{
  let fileID = req.params.fileIDnewNameUserID.split(',')[0];
  let newName = req.params.fileIDnewNameUserID.split(',')[1];
  let userID = req.params.fileIDnewNameUserID.split(',')[2];

  FILE.findOneAndUpdate({'_id':ObjectId(fileID), 'users':userID}, {'s3_key': newName}, {
    new: true
  }, (errorinRenaming, renamedDoc)=>{
    if(errorinRenaming)
    next(res.status(500).send(errorinRenaming));
    else if(renamedDoc==null)
    {
      next(res.status(403).send("The file is not allowed to be renamed by you"))
    }
    else
    {
      console.log(renamedDoc);
    next(res.status(200).send(renamedDoc));
    }
  })
})

router.patch('/addUserToFolder/:accessFolderIDmailAddedUserID',async(req,res,next)=>{
  access = req.params.accessFolderIDmailAddedUserID.split(',')[0]
  folderID = req.params.accessFolderIDmailAddedUserID.split(',')[1];
  mailAdded = req.params.accessFolderIDmailAddedUserID.split(',')[2];
  userID = req.params.accessFolderIDmailAddedUserID.split(',')[3];

  await User.findOne({'email':mailAdded}, async(errorInUser, foundDoc)=>{
    if(errorInUser)
    next(res.status(400).send(errorInUser));
    else if(!foundDoc)
    next(res.status(400).send("can't find user"))
    
    else
    {
      if(access=="All")
      {  
        
          await FOLDER.findOneAndUpdate({'_id':ObjectId(folderID),'users':userID,'users': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: {viewers: foundDoc["_id"] }}, async(errorInUpdatingUser, userDocs)=>{
          if(userDocs==null)
          next(res.status(500)).send("The user can't be added by you");
          else if(!errorInUpdatingUser)
          {
           await FILE.find({'parentFolder': userDocs["_id"], 'users':userID, 'users': { $ne: ObjectId(foundDoc["_id"]) }},(errorInUpdatingFilesWithinFolder, filesWithinFolder)=>{
             if(errorInUpdatingFilesWithinFolder)
                 next(res.status(500).send("Couldn't update files within folder"))
              else if(filesWithinFolder.length)
              {
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
          else
          next(res.status(500).send(errorInUpdatingUser))
          });
      }
        

  if(access=="View"){
    await FOLDER.findOneAndUpdate({'_id':ObjectId(folderID),'users':userID,'viewers': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: {viewers: foundDoc["_id"] }}, async(errorInUpdatingViewer, viewerDocs)=>{
      if(viewerDocs==null)
      next(res.status(400).send("The user can't be added by you"))
      else if(!errorInUpdatingViewer)
      {
        await FILE.find({'parentFolder': viewerDocs["_id"], 'users':userID, 'viewers': { $ne: ObjectId(foundDoc["_id"]) }},async(errorInUpdatingFilesWithinFolder, filesWithinFolder)=>{
          if(errorInUpdatingFilesWithinFolder)
              next(res.status(500).send("Couldn't update files within folder"))
           else if(filesWithinFolder.length)
           {
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
      else
      next(res.status(500).send(errorInUpdatingViewer))
    } )
  }
  }
  })
});
router.patch('/addUserToFile/:accessFileIDmailAddedUserID', async(req,res,next)=>{
  access = req.params.accessFileIDmailAddedUserID.split(',')[0]
  fileID = req.params.accessFileIDmailAddedUserID.split(',')[1];
  mailAdded = req.params.accessFileIDmailAddedUserID.split(',')[2];
  userID = req.params.accessFileIDmailAddedUserID.split(',')[3];

  await User.findOne({'email':mailAdded}, async(errorInUser, foundDoc)=>{
    if(errorInUser)
    next(res.status(400).send(errorInUser));
    else if(!foundDoc)
    next(res.status(400).send("can't find user"))
    
    else
    {
      if(access=="All")
      {
        await FILE.findOneAndUpdate({'_id':ObjectId(fileID),'users':userID,  'users': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: { users: foundDoc["_id"] }}, (errorInUpdatingUser, docs)=>{
      if(docs==null)
      next(res.status(400).send("The user can't be added by you"))
      else if(!errorInUpdatingUser)
      next(res.status(200).send(docs));
      else
      next(res.status(500).send(errorInUpdatingUser))
    } )
  }

  if(access=="View"){
    await FILE.findOneAndUpdate({'_id':ObjectId(fileID),'users':userID,'viewers': { $ne: ObjectId(foundDoc["_id"]) }}, {$push: {viewers: foundDoc["_id"] }}, (errorInUpdatingViewer, viewerDocs)=>{
      if(viewerDocs==null)
      next(res.status(400).send("The user can't be added by you"))
      else if(!errorInUpdatingViewer)
      next(res.status(200).send(viewerDocs));
      else
      next(res.status(500).send(errorInUpdatingViewer))
    } )
  }
  }
  })

});
router.get('/:id', async(req,res,next)=>{
  console.log(req.params.id);
    FILE.find(       
      {
       
         'creator':ObjectId(req.params.id)
        
        ,
        'isIndependant':true
      },
      null,
      {
        sort: { createdAt: 1 }
      },
      (err, docs) => {
        if (err) {
         next(res.status(500).send(err));

        }  
        else
        {
          next(res.status(200).send(docs));
        }
      }
    );
});

router.delete('/folder/:folderIDuserID', async(req,res,next)=>{
let folderID = req.params.folderIDuserID.split(',')[0];
let userID = req.params.folderIDuserID.split(',')[1];
console.log(`-----------${folderID}-----`);
console.log(userID)
  FILE.find({parentFolder: ObjectId(folderID), users: ObjectId(userID)},(err,docs)=>{
   if(!err){console.log("Going to delete them from s3 bucket");
   docs.forEach((doc)=>{
    var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: doc["_id"].toString() };
    s3bucket.deleteObject(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);  
        next(res.status(500).send(err));
      }// error
                     // deleted
    })
   })
  
  }
   else
   throw err;
  });
  FILE.deleteMany({ parentFolder: ObjectId(folderID), users: ObjectId(userID)}, (err, docs)=>{
    if(!err)
    {
      console.log("These are the files");
      console.log(docs);
      FOLDER.findByIdAndDelete(ObjectId(folderID), (error, deleteddoc)=>{
        if(!err)
        {
          next(res.status(200).send(deleteddoc));
        }
        else
         next(res.status(500).send(error));
      })
    }
    else
      next(res.status(500).send(err));
  }); 
});

router.delete('/:fileIDuserID', async(req,res,next)=>{
  let fileID = req.params.fileIDuserID.split(',')[0].toString();
  let userID = req.params.fileIDuserID.split(',')[1].toString();
  
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

router.patch('/files/:fileIDuserID', async(req,res,next)=>{

  let fileID = req.params.fileIDuserID.split(',')[0];
  let userID = req.params.fileIDuserID.split(',')[1];
  FILE.findOne({ _id:ObjectId(fileID.toString()),users:ObjectId(userID.toString())}, function(err, docs) {
    if(err)
    res.status(500).send("I can't find the file");
    else if(docs!=null)
     { docs.favourite = !(docs.favourite);
    docs.save(function(err, updatedDoc) {
      if(!err)res.status(200).send(updatedDoc)
      else res.status(500).send(err);
    }); 
  }
  else
  res.status(400).send("The file cannot be made a favourite for you")

  });

});

router.patch('/folder/:folderIDuserID', async(req,res,next)=>{

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

router.post('/folder', upload.single('folder'),async(req, res, next)=>{

 
  var newFolderUploaded = {
    Name: req.body.folderName,
    users: [req.body.users], 
    viewers:[req.body.users],
    creator: req.body.users
    }

  var document = new FOLDER(newFolderUploaded);
  document.save((err, docs)=>{
    if(err)
    {
      console.log(err);
      res.status(500).send(err);
    
    }
    else
    res.status(200).send(docs);
  });
});
router.get('/sharedFiles/:id', async(req,res,next)=>{
  const userID = req.params.id.toString();
  console.log(userID);
  FILE.find({$or:[{'users':ObjectId(userID)},{'viewers':ObjectId(userID)}], 'creator': { $ne: ObjectId(userID) } },(errorInFindingFiles, files)=>{
       if(!errorInFindingFiles){
         console.log("Incoming shared files");
         console.log(files);
         next(res.status(200).send(files));
       }
       else
       {
         next(res.status(500).send("Couldn't retrieve shared files"))
       }
     }
)})


router.post('/fileinfolder', upload.single('file'), async(req,res,next)=>{

const file = req.file;
const folderID = req.body.folderID;
console.log(file);

var newFileUploaded = {
  description: req.body.description,
  s3_key: file.originalname,
  users: [req.body.users],
  viewers: [req.body.users],
  creator: req.body.users,
  parentFolder: folderID,
  isIndependant: false,
  type: file.originalname.split('.').pop()
}
fs.readFile(file.path, (error, fileContent)=>{
  if(error)
   {
     console.log("error in fs");
     res.status(500).send("Hmm, looks like there is something wrong with the code");
   }
  else if(!error)
  {var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    
    Body: fileContent,
    ContentType: file.mimetype,
    
  };
  
var document = new FILE(newFileUploaded);
document.save(function(filesaveerror, newFile) {
  
  if(!filesaveerror){
      console.log(newFile);
     
      FOLDER.findByIdAndUpdate(folderID,{  $push: { files: newFile._id }}, function(errorinfolder, docs){
        if(!errorinfolder)
        {

          params.Key = newFile["_id"].toString();


          s3bucket.putObject(params, async function(s3err, data) {
            if (s3err) {
              await console.log(err);
              await next(res.status(500).json({ error: true, Message: s3err }));
            } else {
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
router.post('/', upload.single("file"), async(req,res,next)=>{
    const file = req.file;
       
    var newFileUploaded = {
      description: req.body.description,
      s3_key: file.originalname,
      users: [req.body.users],
      viewers: [req.body.users],
      creator: req.body.users,
      type: file.originalname.split('.').pop()
    }

   await fs.readFile(file.path, async(error, fileContent)=>{
     if(error)
     {
       await next(res.status(500).send("The file can't be uploaded"))
     }
    if(!error)
    {
      var params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Body: fileContent,
      ContentType: file.mimetype,
      
    }
    
    var document = new FILE(newFileUploaded);
    await document.save(async function(error, newFile) {
      
      if(!error){
          await console.log(newFile);
         
          params.Key=newFile["_id"].toString();
          await s3bucket.putObject(params, async function(err, data) {

        
            if (err) {
              await console.log(err);
              await next(res.status(500).json({ error: true, Message: err }));
            } else {
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

module.exports = router;



