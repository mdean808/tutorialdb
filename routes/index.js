const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

const landingPages = ["about", "index", "not-logged-in", "search", "signed-out", "submitted", "tutorial", "tutorial-submit", "tutorials"];
for(let i = 0; i < landingPages.length; i++) {
    let pg = landingPages[i] === "" ? "index" : landingPages[i];
    router.get('/' + pg, function(req, res) {
        res.render(pg, {title: toTitleCase(pg)});
    });
}

module.exports = router;

function capitalizeFirstLetter(string) {
	string = string.charAt(0).toUpperCase() + string.slice(1);

	return string.charAt(0).toUpperCase() + string.slice(1);
}

function toTitleCase(str) {
	str = str.replace(/-/g, ' ');
	return str.replace(/\w\S*/g, function (txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
}