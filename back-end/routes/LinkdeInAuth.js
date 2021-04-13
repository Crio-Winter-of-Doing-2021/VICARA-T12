const express = require('express');
const router = express.Router();
const axios = require('axios')

router.get("/", (req,res) => {
    //#swagger.ignore = true
    AuthorizationKey = process.env.LINKEDIN_AUTH_KEY
    return axios.get('https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))', { headers: { Authorization: `Bearer ${AuthorizationKey}` } } )
        .then(response => {
            res.status(200).send(response.data.profilePicture['displayImage~'].elements[2].identifiers[0].identifier);
        })
        .catch(error =>{
            return res.status(429).send('API Limit!');
        })
});

module.exports = router; 