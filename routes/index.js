var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

var landingPages = ["about", "index", "notloggedin", "search", "signedout", "submitted", "tutorial", "tutorial-submit", "tutorials"];
for(var i = 0; i < landingPages.length; i++) {
    let pg = landingPages[i] === "" ? "index" : landingPages[i];
    router.get('/' + pg, function(req, res) {
        res.render(pg, {title: pg});
    });
}

module.exports = router;
