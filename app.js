var express = require('express');
var path = require('path');
var exphbs = require('express-handlebars');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Recaptcha = require('recaptcha-verify');
var swearjar = require('swearjar');
var mysql = require('mysql');
var GoogleAuth = require('google-auth-library');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var auth = new GoogleAuth;
var client = new auth.OAuth2('513403102947-k7qrh4q7s7p5ar7b1dpo27o768e6iq8i.apps.googleusercontent.com', '', '');
var morgan = '101672782678779786564';
var username = '', title = '', link = '', desc = '', summary = '';
var recaptcha = new Recaptcha({
	secret: '6Lf1RzQUAAAAAIr_f2u4A2xbhlAYEPi8IJrZP7SD',
	verbose: true
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.get('/submit-captcha', function (req, res) {
	// get the user response (from reCAPTCHA)
	var userResponse = req.query['g-recaptcha-response'];
	username = req.query.username;
	title = req.query.title;
	link = req.query.link;
	desc = req.query.details;
	summary = req.query.summary;
	recaptcha.checkResponse(userResponse, function (error, response) {
		if (error) {
			console.log(error);
		}
		if (response.success) {
			var allWords = title.concat(desc, ' ', link, ' ', username, ' ', summary);
			if (swearjar.profane(allWords)) {
				res.status(200).redirect('/tutorial-submit?error=profanity');
			} else {
				res.status(200).redirect('/submitted');
				var sql = "INSERT INTO tutorials (title, link, description, summary, author) VALUES ('" + title + "', '" + link + "', '" + desc + "', '" + summary + "', '" + username + "')";
				con.query(sql, function (err, result) {
					if (err) {
						console.log(err);
					} else {
						JSON.stringify({
							addedTutorial: result
						})
					}
				});
				// save session.. create user.. save form data.. render page, return json.. etc.
			}
		} else {
			res.status(200).redirect('/tutorial-submit?error=Please+solve+the+ReCaptcha');
			// show warning, render page, return a json, etc.
		}
	});
});

function handleDisconnect() {
	con = mysql.createConnection({
		host: "us-cdbr-iron-east-05.cleardb.net",
		user: "b2fc79f947af92",
		password: "8ed9f6a6",
		database: "heroku_432349a4f02959f"
	}); // Recreate the connection, since the old one cannot be reused.

	con.connect(function (err) {              // The server is either down
		if (err) {                                     // or restarting (takes a while sometimes).
			console.log('error when connecting to db:', err);
			setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
		}// to avoid a hot loop, and to allow our node script to
	});                                     // process asynchronous requests in the meantime.
											// If you're also serving http, display a 503 error.
	con.on('error', function (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
			handleDisconnect();                         // lost due to either server restart, or a
		} else {                                      // connnection idle timeout (the wait_timeout
			console.log(err); // server variable configures this)
		}
	});
}

handleDisconnect();

//console.log('Server running on http://localhost:8080');
//url.open('http://localhost:8080');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/api/create-db', function (req, res) {
	con.query("CREATE DATABASE tutorialdb", function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Database created");
			console.log(result);
		}
	});
});

app.get('/api/create-table', function (req, res) {
	var sql = "CREATE TABLE tutorials (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), link VARCHAR(255), description VARCHAR(255), summary VARCHAR(255), author VARCHAR(255))";
	con.query(sql, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Table created");
		}
	});
});

app.post('/api/add-tutorial', function (req, res) {
	if (con.state !== 'disconnected')
		var sql = "INSERT INTO tutorials (title, link, description, summary, author) VALUES ('" + req.query.title + "', '" + req.query.link + "', '" + req.query.desc + "', '" + req.query.summary + "', '" + req.query.author + "')";
	con.query(sql, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Added Tutorial:", result);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				addedTutorial: result
			}));
		}
	});
});

app.post('/api/get-all-tutorials', function (req, res) {
	con.query("SELECT * FROM tutorials", function (err, result, fields) {
		if (err) {
			console.log(err);
		} else {
			console.log(result);
		}
	});
});

app.post('/api/search-tutorials', function (req, res) {
	if (con.state !== 'disconnected') {
		con.query("SELECT * FROM tutorials WHERE title LIKE '%" + req.query.q + "%'", function (err, result) {
			if (err) {
				console.log(err)
			} else {
				console.log(result);
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					searchResults: result
				}));
			}
		});
	}

});

app.post('/api/get-tutorial', function (req, res) {
	con.query("SELECT * FROM tutorials WHERE id = '" + req.query.id + "'", function (err, result) {
		if (err) {
			console.log(err);
		} else {
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				searchResults: result
			}));
		}
	});
});

app.post('/api/delete-tutorial', function (req, res) {
	var token = req.body.tokenId;
	var tutorialID = req.body.tutorialID;
	var userid = '';
	client.verifyIdToken(
		token,
		'513403102947-k7qrh4q7s7p5ar7b1dpo27o768e6iq8i.apps.googleusercontent.com',
		function (e, login) {
			var payload = login.getPayload();
			userid = payload['sub'];
			// If request specified a G Suite domain:
			//var domain = payload['hd'];
		});
	if (userid === morgan) {
		var sql = "DELETE FROM tutorials WHERE id = '" + tutorialID + "'";
		con.query(sql, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				res.writeHead(200, {'Content-Type': 'application/json'});
				res.end(JSON.stringify({
					delete: 'Succesful: tutorial number ' + tutorialID + ' deleted.'
				}));
			}
		});
	} else {
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.end(JSON.stringify({
			delete: 'failed: incorrect token'
		}));
	}
});

app.post('/api/auth-user', function (req, res) {
	var token = req.body.tokenId;
	client.verifyIdToken(
		token,
		'513403102947-k7qrh4q7s7p5ar7b1dpo27o768e6iq8i.apps.googleusercontent.com',
		function (e, login) {
			var payload = login.getPayload();
			var userid = payload['sub'];
			// If request specified a G Suite domain:
			//var domain = payload['hd'];
		});
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({
		signIn: 'succesful'
	}));
});

app.get('/api/set-text', function (req, res) {
	var sqlTitle = 'ALTER TABLE tutorials MODIFY title TEXT;';
	var sqlLink = 'ALTER TABLE tutorials MODIFY link TEXT;';
	var sqlDescription = 'ALTER TABLE tutorials MODIFY description TEXT;';
	var sqlSummary = 'ALTER TABLE tutorials MODIFY summary TEXT;';
	var sqlAuthor = 'ALTER TABLE tutorials MODIFY author TEXT;';

	con.query(sqlTitle, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set title as text');
		}
	})
	con.query(sqlLink, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set link as text');
		}
	})
	con.query(sqlDescription, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set desc as text');
		}
	})
	con.query(sqlSummary, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set summary as text');
		}
	})
	con.query(sqlAuthor, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set author as text');
		}
	})
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.end(JSON.stringify({
		text: 'succesful'
	}));
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {``
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
