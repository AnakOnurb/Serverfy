var express = require('express');
var router = express.Router();

// use session auth to secure the angular app files
router.use('/', function (req, res, next) {
    var autenticacaoValida = (req.session.token !== undefined);
    var caminhosAutorizados = (req.path === '/assets/img/gatinho.jpg') || (req.path === '/login');
    if ((autenticacaoValida) || (caminhosAutorizados))
        next();
    else
        return res.redirect('/login?returnUrl=' + encodeURIComponent('/app' + req.path));
});

// make JWT token available to angular app
router.get('/token', function (req, res) {
    res.send(req.session.token);
});

// make userId  available to angular app
router.get('/userId', function (req, res) {
    res.send(req.session.userId);
});


// serve angular app files from the '/app' route
router.use('/', express.static('app'));

module.exports = router;