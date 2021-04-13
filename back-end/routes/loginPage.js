const express = require("express");
const router = express.Router();
const path = require("path");
router.get('/', (req,res) => 
{
    //#swagger.ignore = true
    res.sendFile(path.join(__dirname,'..', 'build', 'index.html'))
    //res.render('welcomePage', {title: 'Storage Drive - Backend', titleMessage: 'Hello, Welcome to the backend!', redirectMessage: 'Please redirect to the following links', link1: 'test1', link2: 'test2'});
});

module.exports = router;