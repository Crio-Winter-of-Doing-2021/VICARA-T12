const bodyParser = require('body-parser');
const express = require('express');
require("dotenv").config();
require('./db');
const helmet = require('helmet');
const morgan = require('morgan');
const auth = require('./routes/authentication');
const authentication = require('./middleware/authentication');
const cors = require('cors')
const config = require('config');
const uploadController = require('./routes/uploadController');
const debug = require('debug')('app:startup');
const welcomePage = require('./routes/welcomePage');
const users = require('./routes/users');
const LinkedInProfileInfo = require('./routes/LinkdeInAuth')
const sendMail = require('./routes/sendMail')
const loginPage = require('./routes/loginPage');
const path = require('path');
const app = express();
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')


app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

const cookieParser = require('cookie-parser')
const {login, refresh} = require('./routes/authentication');

app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser())
app.use(helmet());
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Origin', 'https://vicara-storage-drive.netlify.app');
    res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, GET, POST, OPTIONS,PUT');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});
var corsOptions = {
    origin: 'https://vicara-storage-drive.netlify.app',
    credentials : true
   }



app.options('*', cors(corsOptions));
//app.use(cors())
app.use('/api/user', users);
app.use('/api/user/login',auth);
app.use('/api/user/sendMail', sendMail);
app.use('/api',[authentication.auth],uploadController);
app.use('/welcome',welcomePage);
app.use('/api/LinkedInProfileInfo', LinkedInProfileInfo);





app.use('/*', loginPage);
// Setting the html using pug 
app.set('view engine', 'pug');
app.set('views','./views');

//Config check for pvt key 




// To logg our requests on console. Change during production. Not needed
if( app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debug('Morgan enabled')
}

//Define env var for PORT or run default on 3000.
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(` Listening on port ${port} `);
});

module.exports = app;
