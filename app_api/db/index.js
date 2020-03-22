const mongoose = require('mongoose');

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.
const dbURI = process.env.MONGODB_URI ||  'mongodb://127.0.0.1:27017/movies';

console.log("dbURI:"+dbURI);

mongoose.connect(dbURI, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
 }, function (err, res) {
  if (err) { 
    console.log('ERROR connecting to: ' + dbURI + '. ' + err);
    process.exit(0);
  } else {
    console.log('Succeeded connected to: ' + dbURI);
  }
});
