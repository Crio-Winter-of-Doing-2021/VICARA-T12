
//DB connection

const mongoose = require('mongoose');
// To get rid of deprecation warning
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/Vicara', { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to Mongodb!') )
    .catch(err => console.error('Could not connect to Mongodb!', err));

module.exports = mongoose;