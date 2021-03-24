require("dotenv").config();
const express = require("express");
const router = express.Router();
const FILE = require("../models/file");
const FOLDER = require("../models/folder");
const multer = require("multer");
var AWS = require("aws-sdk");
const fileUpload = require('express-fileupload');
const ObjectId = require('mongoose').Types.ObjectId;
var storage = multer.memoryStorage();
var upload = multer({storage:storage});
const s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
const s3FileURL = process.env.AWS_Uploaded_File_URL_Link;


router.get('/folder/:id', async(req,res,next)=>{
  console.log(req.params.id);
    FOLDER.find(
      {
        'users':ObjectId(req.params.id),
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
        res.status(200).send(docs);
      }
    );
});


router.get('/:id', async(req,res,next)=>{
  console.log(req.params.id);
    FILE.find(       
      {
        'users':ObjectId(req.params.id),
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
        res.status(200).send(docs);
      }
    );
});

router.delete('/folder/:id', async(req,res,next)=>{
  FILE.deleteMany({ parentFolder: req.params["id"]}, (err, docs)=>{
    if(!err)
    {
      console.log(docs);
      FOLDER.findByIdAndDelete(req.params["id"], (error, deleteddoc)=>{
        if(!err)
        {
          res.status(200).send(deleteddoc);
        }
        else
          res.status(500).send(error);
      })
    }
    else
      res.status(500).send(err);
  }); 
});

router.delete('/:id', async(req,res,next)=>{
  console.log(req.params.id);
  FILE.findOneAndDelete({ _id: ObjectId(req.params["id"]) }, (err,docs)=>{
    if(err){
      return next(err);
    }
    else if(docs!=null){
      var params = {  Bucket: process.env.AWS_BUCKET_NAME, Key: docs["s3_key"] };
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

router.patch('/files/:id', async(req,res,next)=>{
  console.log(req.params.id);
  FILE.findOne({ _id: req.params.id }, function(err, docs) {
    docs.favourite = !(docs.favourite);
    docs.save(function(err, updatedDoc) {
      if(!err)res.status(200).send(updatedDoc)
      else res.status(500).send(err);
    }); 
  });
});

router.patch('/folder/:id', async(req,res,next)=>{
  console.log(req.params.id);
  FOLDER.findOne({ _id: req.params.id }, function(err, docs) {
    docs.favourite = !(docs.favourite);
    docs.save(function(err, updatedDoc) {
      if(!err)res.status(200).send(updatedDoc)
      else res.status(500).send(err);
    }); 
  });
});

router.post('/folder', upload.single('file'), async(req, res, next)=>{

 
  var newFolderUploaded = {
    Name: req.body.folderName,
    users: [req.body.users]
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

router.post('/fileinfolder', upload.single('file'), async(req,res,next)=>{
  console.log("hmm");
const file = req.file;
const folderID = req.body.folderID;
console.log(file);


  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read"
  };

  s3bucket.upload(params, function(err, data) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: true, Message: err });
    } else {
      
      var newFileUploaded = {
        description: req.body.description,
        fileLink: `${s3FileURL}/${file.originalname}`,
        s3_key: params.Key,
        users: [req.body.users],
        parentFolder: folderID,
        isIndependant: false
      };
      var document = new FILE(newFileUploaded);
      document.save(function(error, newFile) {
        
        if(!error){
            console.log(newFile);
           
            FOLDER.findByIdAndUpdate(folderID,{  $push: { files: newFile._id }}, function(err, docs){
              if(!err)
              {
                
                res.status(200).send(docs);

              }
              else
              res.status(500).send(err);
            });
        }
        if (error) {
          throw error;
        }
      });
    }});






})
router.post('/', upload.single("file"), async(req,res,next)=>{
    const file = req.file;
       
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
      };
    
      s3bucket.upload(params, function(err, data) {
        if (err) {
          console.log(err);
          res.status(500).json({ error: true, Message: err });
        } else {
          
          var newFileUploaded = {
            description: req.body.description,
            fileLink: s3FileURL + file.originalname,
            s3_key: params.Key,
            users: [req.body.users]
          };
          var document = new FILE(newFileUploaded);
          document.save(function(error, newFile) {
            
            if(!error){
                console.log(newFile);
                res.status(200).send(newFile);
            }
            if (error) {
              throw error;
            }
          });
         
        }
      });

})

module.exports = router;



