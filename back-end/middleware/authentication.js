const jwt = require('jsonwebtoken');

require("dotenv").config();
function auth( req, res, next ){
    const token = req.cookies.jwt;
    console.log("..................")
    console.log(req.cookies.jwt);
    console.log("------------")
    if(!token)
     res.status(401).send('Access denied. No token')

    try{
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
            if(err){
                console.log(err);
               res.status(401).send({message:err})
                 
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
