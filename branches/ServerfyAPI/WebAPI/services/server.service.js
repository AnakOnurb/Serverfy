var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('server');

var service = {};

service.getById = getById;
service.searchByName = searchByName;
service.getAll = getAll;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;

function getById(_id) {
    var deferred = Q.defer();

    db.server.findById(_id, function (err, ServerObject) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (ServerObject) {
            // return Server
            deferred.resolve(_.omit(ServerObject, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(ServerObject) {
    var deferred = Q.defer();
    
    // validation    
    db.server.findOne(        
        { code: ServerObject.ip },
        function (err, ServerObject) {
            if (err) deferred.reject(err.name + ': ' + err.message);            
            if (ServerObject) {
                // Server id already exists
                deferred.reject('Server IP "' + ServerObject.ip + '" is already used');
            } else {
                createServer();
            }
        });

    function createServer() {
        // set user object to userParam without the cleartext password
        var Server = ServerObject;

        db.server.insert(
            Server,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, ServerObject) {
    var deferred = Q.defer();

    // validation
    db.server.findById(_id, function (err, Server) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (Server.code !== ServerObject.code) {
            // Server id has changed so check if the new code is already taken
            db.server.findOne(
                { code: ServerObject.code },
                function (err, ServerObject) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (ServerObject) {
                        // Server already exists
                        deferred.reject('Server Code "' + req.body.code + '" is already taken')
                    } else {
                        updateServer();
                    }
                });
        } else {
            updateServer();
        }
    });

    function updateServer() {
        // fields to update
        var set = {
            ip: ServerObject.ip,
            host: ServerObject.host            
        };

        db.server.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.server.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function searchByName(name) {
    var deferred = Q.defer();

    db.server.findOne(
        { name: name },
        function (err, ServerList) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (ServerList) {
                deferred.resolve(_.omit(ServerObject, 'hash'));
            } else {
                deferred.reject('The search returned no results');
            }
        });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.server.find({}).toArray(function (err, ServerList) {
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
}