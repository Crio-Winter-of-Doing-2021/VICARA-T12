const { User, validate, validatePatch } = require('../models/users'); 
const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var cors = require('cors')
router.use(cors())

router.post('/', async (req,res) => {
    const {error} = validate(req.body);
    if ( error )
        return res.status(400).send(error.details[0].message);

    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if (password != confirmPassword) 
        return res.status(400).send('Passwords do not match!');

    let user = await User.findOne({ email: req.body.email })
    if (user) 
        return res.status(400).send('User already registered.');

    user = new User( _.pick(req.body, ['name', 'email', 'password']) );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.send( _.pick(user, ['name', 'email'] ) );
});

router.patch('/update/:id', async (req,res) => {
    const {error} = validatePatch(req.body);
    if ( error )
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ _id: req.body.id })

    user = new User( _.pick(req.body, ['name', 'password']) );
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    res.send( _.pick(user, ['name'] ) );
});

module.exports = router; 