var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('server');

var service = {};

service.getVersion = getVersion;

module.exports = service;

function getVersion() {
    var deferred = Q.defer();

        if (1==1) {
            deferred.resolve("Version 1.2");
        } 
        else {
            deferred.resolve();
        }

    return deferred.promise;
}