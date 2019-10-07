var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('inventory');

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

    db.inventory.findById(_id, function (err, productObject) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (productObject) {
            // return product
            deferred.resolve(_.omit(productObject, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(productObject) {
    var deferred = Q.defer();
    
    // validation
    db.inventory.findOne(
        { code: productObject.code },
        function (err, productObject) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (productObject) {
                // product id already exists
                deferred.reject('Product Code "' + productObject.code + '" is already used');
            } else {
                createProduct();
            }
        });

    function createProduct() {
        // set user object to userParam without the cleartext password
        var product = productObject;

        db.inventory.insert(
            product,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, productObject) {
    var deferred = Q.defer();

    // validation
    db.inventory.findById(_id, function (err, product) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (product.code !== productObject.code) {
            // product id has changed so check if the new code is already taken
            db.inventory.findOne(
                { code: productObject.code },
                function (err, productObject) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (productObject) {
                        // product already exists
                        deferred.reject('Product Code "' + req.body.code + '" is already taken')
                    } else {
                        updateProduct();
                    }
                });
        } else {
            updateProduct();
        }
    });

    function updateProduct() {
        // fields to update
        var set = {
            date: productObject.date,
            type: productObject.type,
            brand: productObject.brand,
            charac: productObject.charac,
            size: productObject.size,
            color: productObject.color,
            labelprice: productObject.labelprice,
            pricepaid: productObject.pricepaid,
            suggestedprice: productObject.suggestedprice
        };

        db.inventory.update(
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

    db.inventory.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function searchByName(name) {
    var deferred = Q.defer();

    db.inventory.findOne(
        { name: name },
        function (err, productList) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (productList) {
                deferred.resolve(_.omit(productObject, 'hash'));
            } else {
                deferred.reject('The search returned no results');
            }
        });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.inventory.find({}).toArray(function (err, productList) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (productList) {
            // return product
            deferred.resolve(_.omit(productList, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}