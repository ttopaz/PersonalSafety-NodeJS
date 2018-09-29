var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    Client = mongo.MongoClient,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('tracks', server, {w:0});

var connectWithRetry = function() {
  return mongoose.connect(mongoUrl, function(err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};

var connectToDb = function() {
   db.open(function(err, db) 
   {
        if(!err) 
        {
            console.log("Connected to 'tracks' database");
            return true;
        }
        else
        {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectToDb, 5000);
            return false;
        }
   });
}
connectToDb(); 

db.on('connecting', function() {
    console.log('connecting to MongoDB...');
  });

  db.on('error', function(error) {
    console.error('Error in MongoDb connection: ' + error);
  });
  db.on('connected', function() {
    console.log('MongoDB connected!');
  });
  db.once('open', function() {
    console.log('MongoDB connection opened!');
  });
  db.once('close', function() {
    console.log('MongoDB connection closed! - retrying');
  });
  db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
  });
  db.on('disconnected', function() {
    console.log('MongoDB disconnected!');
  });
module.exports = db;