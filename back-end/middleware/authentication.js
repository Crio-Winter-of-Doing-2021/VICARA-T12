const jwt = require('jsonwebtoken');
const config = require('config');

function auth( req, res, next ){
    const token = req.header('Authorization');
    if(!token)
        return res.status(401).send('Access denied. No token')

    try{
        req.user = jwt.verify(token, config.get('jwtPrivateKey'),(err,decoded)=>{
            if(err){
                return res.status(401).send({message:"Unauthorised. Denied entry!"})

            }
            req.userId= decoded.id;
            //next();
        });
        next();
    }
    catch(exception){
        res.status(400).send('Invalid token.');
    }

}

module.exports = {auth};
