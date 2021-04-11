const express = require('express');
const router = express.Router();

router.get('/', (req,res) => {
    /*res.sendFile(process.cwd()+"../../front-end/build/index.html/welcome")*/
    //#swagger.ignore = true
    res.render('welcomePage', {title: 'Storage Drive - Backend', titleMessage: 'Hello, Welcome to the backend!', redirectMessage: 'Please redirect to the following links', link1: 'test1', link2: 'test2'});
});



module.exports = router;