var nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
// Route used for sending mail from default mail account ( Vicara server in gmail ) to the end user.
router.post('/', async (req,res) => {
    console.log(req.body.email)
    var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'vicaraa2@gmail.com',
        pass: 'vicaraAdmin123'
    }
    });

    var mailOptions = {
    from: 'vicaraa2@gmail.com',
    to: req.body.email,
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
        res.send(error)
    } else {
        console.log('Email sent: ' + info.response);
        res.status(200).send("Success")
    }
    })
});

module.exports = router;
