const bodyParser = require('body-parser');
const express = require('express');
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
const loginPage = require('./routes/loginPage');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.use(helmet());

app.use('/api/users', users);
app.use('/api/auth',auth);
app.use('/api/upload',[authentication.auth],uploadController);
app.use('/welcome',[authentication.auth],welcomePage);


app.use('/*', loginPage);
// Setting the html using pug 
app.set('view engine', 'pug');
app.set('views','./views');

//Config check for pvt key 
if(!config.get('jwtPrivateKey')){
    console.error(' jwtPrivateKey is not defined.')
    process.exit(1);
}



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

