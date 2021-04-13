const { User, validate, validatePatch } = require('../models/users'); 
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


router.post('/register', async (req,res) => {

    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint used for user registration.'

    const {error} = validate(req.body);
    if ( error )
        return res.status(400).send(error.details[0].message);
    console.log(req.body.name)
    let user = await User.findOne({ email: req.body.email })
    if (user) 
        return res.status(400).send('User already registered.');

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword) 
        return res.status(400).send('Passwords do not match!');

    user = new User( _.pick(req.body, ['name', 'email', 'password']) );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.send( _.pick(user, ['name', 'email'] ) );
});

router.patch('/update/:id', async (req,res) => {

    // #swagger.tags = ['User']
    // #swagger.description = 'Endpoint used for updating user information.'
    

    console.log(req.body)
    if( req.body.password == ''){
        req.body.password = 'testPasswordForvalidation'
        const {error} = validatePatch(req.body);
        if ( error )
            return res.status(400).send(error.details[0].message);
            req.body.password = null
    }
    else{
        const {error} = validatePatch(req.body);
        if ( error )
            return res.status(400).send(error.details[0].message);
    }
    const salt = await bcrypt.genSalt(10);
    let resetPassword
    if(req.body.password)
         resetPassword = await bcrypt.hash(req.body.password, salt);
    User.findOne({ email: req.body.email }, function(err, docs) {
        docs.name = req.body.name;
        if(req.body.password)
            docs.password = resetPassword
        docs.save(function(err, updatedDoc) {
            if(!err)
                res.status(200).send(updatedDoc)
            else {
                console.log(err)
                res.status(500).send(err);
            }
                
        }); 
    });
});

module.exports = router; 