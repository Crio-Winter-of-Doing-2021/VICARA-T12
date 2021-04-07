
//DB connection

const mongoose = require('mongoose');
// To get rid of deprecation warning
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
const dbUri = "mongodb+srv://RahulTest:testPassword@cluster0.vwy8w.mongodb.net/Vicara?retryWrites=true&w=majority"
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to Mongodb!') )
    .catch(err => console.error('Could not connect to Mongodb!', err));

module.exports = mongoose;

