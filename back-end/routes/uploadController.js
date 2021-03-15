
require("dotenv").config();
const express = require("express");
const router = express.Router();
const FILE = require("../models/file");
const multer = require("multer");
var AWS = require("aws-sdk");
const fileUpload = require('express-fileupload');
const ObjectId = require('mongoose').Types.ObjectId;
var storage = multer.memoryStorage();
var upload = multer({storage:storage});
router.get('/', async(req,res,next)=>{
    FILE.find(
        {'users[0]':req.id},
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

router.delete('/:id', async(req,res,next)=>{
console.log(req.params.id);
FILE.deleteOne({ _id: ObjectId(req.params["id"]) }, (err,docs)=>{
  if(err){
    return next(err);
  }
  res.status(200).send(docs);
})
});
router.post('/', upload.single("file"), async(req,res,next)=>{
    const file = req.file;
    const s3FileURL = process.env.AWS_Uploaded_File_URL_Link;
    let s3bucket = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
      });
    
   
    
      var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
      };
    
      s3bucket.upload(params, function(err, data) {
        if (err) {
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
                  res.send(newFile);
              }
            if (error) {
              throw error;
            }
          });
          //res.send({ data });
        }
      });

})

module.exports = router;



