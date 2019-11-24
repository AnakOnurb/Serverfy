var config = require('config.json');
var express = require('express');
var router = express.Router();
var serverService = require('services/server.service');

// routes
router.get('/version', getVersion);

module.exports = router;

function getServer(req, res) {
    commandService.getVersion()
        .then(function (Version) {            
            if (Version) {
                res.send(Version);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}