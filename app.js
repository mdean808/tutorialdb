const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const Recaptcha = require('recaptcha-verify');
const swearjar = require('swearjar');
const mysql = require('mysql');
const GoogleAuth = require('google-auth-library');

const index = require('./routes/index');
const users = require('./routes/users');

const app = express();
const auth = new GoogleAuth;
const client = new auth.OAuth2('513403102947-k7qrh4q7s7p5ar7b1dpo27o768e6iq8i.apps.googleusercontent.com', '', '');
const morgan = '101672782678779786564';
let username = '', title = '', link = '', desc = '', summary = '';
const recaptcha = new Recaptcha({
	secret: '6Lf1RzQUAAAAAIr_f2u4A2xbhlAYEPi8IJrZP7SD',
	verbose: true
});
let con;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.get('/submit-captcha', function (req, res) {
	// get the user response (from reCAPTCHA)
	const userResponse = req.query['g-recaptcha-response'];
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
			const allWords = title.concat(desc, ' ', link, ' ', username, ' ', summary);
			if (swearjar.profane(allWords)) {
				res.status(200).redirect('/tutorial-submit?error=profanity');
			} else {
				res.status(200).redirect('/submitted');
				const sql = "INSERT INTO tutorials (title, link, description, summary, author) VALUES ('" + title + "', '" + link + "', '" + desc + "', '" + summary + "', '" + username + "')";
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
		} else {                                      // connection idle timeout (the wait_timeout
			console.log(err); // server variable configures this)
		}
	});
}

handleDisconnect();

//console.log('Server running on http://localhost:8080');
//url.open('http://localhost:8080');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Create DB (used locally)
app.post('/api/create-db', function (req, res) {
	con.query("CREATE DATABASE tutorialdb", function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Database created!");
			console.log(result);
		}
	});
});
*/

/* Crate table (used locally)
app.get('/api/create-table', function (req, res) {
	const sql = "CREATE TABLE tutorials (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255), link VARCHAR(255), description VARCHAR(255), summary VARCHAR(255), author VARCHAR(255))";
	con.query(sql, function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log("Table created");
		}
	});
});
<*/
app.post('/api/add-tutorial', function (req, res) {
	/** @namespace req.query.author */
	const sql = "INSERT INTO tutorials (title, link, description, summary, author) VALUES ('" + req.query.title + "', '" + req.query.link + "', '" + req.query.desc + "', '" + req.query.summary + "', '" + req.query.author + "')";
	if (con.state !== 'disconnected')
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
	con.query("SELECT * FROM tutorials", function (err, result) {
		if (err) {
			console.log(err);
		} else {
			console.log(result.length);
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.end(JSON.stringify({
				allTutorials: result.length
			}));
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
	const token = req.body.tokenId;
	const tutorialID = req.body.tutorialID;
	let userid = '';
	client.verifyIdToken(
		token,
		'513403102947-k7qrh4q7s7p5ar7b1dpo27o768e6iq8i.apps.googleusercontent.com',
		function (e, login) {
			const payload = login.getPayload();
			userid = payload['sub'];
			// If request specified a G Suite domain:
			//var domain = payload['hd'];
		});
	if (userid === morgan) {
		const sql = "DELETE FROM tutorials WHERE id = '" + tutorialID + "'";
		con.query(sql, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
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
	const token = req.body.tokenId;
	let userid = '';
	client.verifyIdToken(
		token,
		'513403102947-k7qrh4q7s7p5ar7b1dpo27o768e6iq8i.apps.googleusercontent.com',
		function (e, login) {
			if (e) {
				console.log(e);
			} else {
				const payload = login.getPayload();
				userid = payload['sub'];
				if (userid === morgan) {
					res.end(JSON.stringify({
						signIn: 'succesful',
						admin: true
					}));
				} else {
					res.writeHead(200, {'Content-Type': 'application/json'});
					res.end(JSON.stringify({
						signIn: 'succesful',
						admin: false
					}));
				}
			}
		});
});
/* Utility
app.get('/api/set-text', function (req, res) {
	const sqlTitle = 'ALTER TABLE tutorials MODIFY title TEXT;';
	const sqlLink = 'ALTER TABLE tutorials MODIFY link TEXT;';
	const sqlDescription = 'ALTER TABLE tutorials MODIFY description TEXT;';
	const sqlSummary = 'ALTER TABLE tutorials MODIFY summary TEXT;';
	const sqlAuthor = 'ALTER TABLE tutorials MODIFY author TEXT;';

	con.query(sqlTitle, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set title as text');
		}
	});
	con.query(sqlLink, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set link as text');
		}
	});
	con.query(sqlDescription, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set desc as text');
		}
	});
	con.query(sqlSummary, function (err, result) {
		if (err) {
			console.log(err)
		} else {
			console.log('Set summary as text');
		}
	});
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
*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
