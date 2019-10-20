var config = require('config.json');
var express = require('express');
var router = express.Router();
var serverService = require('services/server.service');

// routes
router.post('/addserver', addServer);
router.get('/search/:_name', searchName);
router.get('/:_id', getServer);
router.get('', getAll);
router.put('/:_id', updateServer);
router.delete('/:_id', deleteServer);

module.exports = router;

function addServer(req, res) {    
    serverService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getServer(req, res) {
    serverService.getById(req.params._id)
        .then(function (ServerObject) {
            if (ServerObject) {
                res.send(ServerObject);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    serverService.getAll()
        .then(function (ServerList) {            
            if (ServerList) {
                res.send(ServerList);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateServer(req, res) {
    serverService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteServer(req, res) {
    serverService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function searchName(req, res) {
    serverService.searchByName(req.params._name)
        .then(function (ServerList) {
            if (ServerList) {
                res.send(ServerList);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}