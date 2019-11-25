function connect()
{
    var MongoClient = require('mongodb').MongoClient;
    var connectionString: "mongodb://serverfyAdmin:1234@serverfy-shard-00-00-it25m.azure.mongodb.net:27017,serverfy-shard-00-01-it25m.azure.mongodb.net:27017,serverfy-shard-00-02-it25m.azure.mongodb.net:27017/serverfyDB?ssl=true&replicaSet=serverfy-shard-0&authSource=admin&retryWrites=true&w=majority";
    MongoClient.connect(connectionString, function(err, client) {
      if(err) throw err;
      return client;
    });
}

function getAllServers(){
  var client = connect();
  var collection =  client.db("serverfyDB").collection("server");

  var deferred = Q.defer();

  collection.find({}).toArray(function (err, ServerList) {
      if (err) deferred.reject(err.name + ': ' + err.message);
      if (ServerList) {
          // return Server
          deferred.resolve(_.omit(ServerList, 'hash'));
      } else {
          // user not found
          deferred.resolve();
      }
  });

  return deferred.promise;

  client.close();
}

exports.getAllServers() = getAllServers;
