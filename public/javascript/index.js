var idToken;

function recaptchaCallback() {
	$('#submitBtn').removeAttr('disabled');
	document.getElementById('submitBtn').setAttribute("class", "btn btn-primary");
	document.getElementById('submitBtn').style.cursor = 'pointer';
}

function onSignIn(googleUser) {
	// noinspection JSUnresolvedFunction
	var profile = googleUser.getBasicProfile();
	// noinspection JSUnresolvedFunction
	idToken = googleUser.getAuthResponse().id_token;
	$('#google-token').val(idToken);
	$.ajax({
		method: 'post',
		url: '/api/auth-user',
		data: {
			tokenId: idToken,
			id: getQueryString('id')
		},
		success: function (result) {
			console.log(result);
			if (result.editable && result.tutorial) {
				$('#edit').html('<div class="row center">\n' +
					'        <a data-target="edit-modal" class="btn waves-effect waves-light waves-block modal-trigger">Edit</a>\n' +
					'        <br>\n' +
					'        <a data-target="delete-modal" class="btn red waves-effect waves-light waves-block modal-trigger">Delete</a>\n' +
					'    </div>');
			} else if (!result.tutorial) {
				$('#edit').html('<div class="row center"> <h1>404</h1> </div>')
			}
			$('#g-signIn').hide();
			$('#g-signIn1').hide();
			$('#logged-in').show();
			$('#nav-logged-in').show();
			$('#new-tutorial').show();
			$('#login-dropdown').show();
			document.getElementById('new-tutorial').style.paddingLeft = '-8px';
			document.getElementById('login-dropdown').innerHTML = "Welcome, " + profile.getName() + '<i class="material-icons right">arrow_drop_down</i>';
			document.getElementById('nav-welcome').innerHTML = "Welcome, " + profile.getName();

		},
		error: function (err) {
			console.log(err);
		}
	});
	/*
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	*/
}

function signOut() {
	// noinspection JSUnresolvedFunction
	/** @namespace gapi.auth2 */
	var auth2 = gapi.auth2.getAuthInstance();
	// noinspection JSUnresolvedFunction
	auth2.signOut().then(function () {
		console.log('User signed out.');
	});
	document.getElementById('g-signIn').style.display = 'block';
	document.getElementById('g-signIn1').style.display = 'none';
	document.getElementById('logged-in').style.display = 'none';
	document.getElementById('new-tutorial').style.display = 'none';

}


function search() {
	$.ajax({
		method: 'post',
		url: "/api/search-tutorials?q=" + getQueryString('q'),
		success: function (result1) {
			var theSnippet = '<div class="row"><div class="col s12 m12"><div class="card z-depth-0" style="border-radius: 5px"><div class="card-content"> <a href="%LINK%"><h5 style="color: #0094ff; margin-top: 0px;">%TITLE%</h5></a> <p>%DESCRIPTION%</p></div></div></div></div>\n';
			var results = result1.searchResults;
			document.getElementById('searchHeader').innerHTML = "Search - " + results.length + " results found";
			for (var i = 0; i < results.length; i++) {
				var result = results[i];
				$('#loading').remove();
				// noinspection JSUnresolvedVariable
				document.getElementById('searchResults').innerHTML += theSnippet.replace(/%TITLE%/g, result.title).replace(/%DESCRIPTION%/g, new showdown.Converter().makeHtml(result.summary)).replace(/%LINK%/g, "tutorial?id=" + result.id);
			}
			$('#loading').remove();
		},
		error: function (result, err) {
			console.log("err", err);
			console.log(result);
			$('#loading').remove();
		}
	});
}


function loadTutorial() {
	$.ajax({
		method: 'post',
		url: "/api/get-tutorial?id=" + getQueryString('id'),
		success: function (result) {
			var tutorial = result.tutorialResults[0];
			if (result.tutorialResults === false) {
				M.toast({html: 'This tutorial does not exist'});
				$('#tutorial-container').hide();
				$('#edit').html('<div class="row center"> <h1>404</h1> </div>')
			} else {
				$('#tutorial-title').html(tutorial.title);
				$('#form-title').val(tutorial.title);

				$('#creator-name').html(tutorial.author);
				$('#view-count').html(tutorial.views.toLocaleString());
				// noinspection JSUnresolvedVariable
				$('#tutorial-desc').html(new showdown.Converter().makeHtml(tutorial.description));
				$('#tutorial-details').html(tutorial.description);
				$('#tutorial-details-preview').html(new showdown.Converter().makeHtml(document.getElementById('tutorial-details').value));

				$('#tut-cont').append("<a href='" + tutorial.link + "'>" + tutorial.link + "</a>");
				$('#form-link').val(tutorial.link);

				$('#tutorial-summary').html(tutorial.summary);
				$('#loading').hide();
			}
		},
		error: function (result, err) {
			console.log("err", err);
			console.log(result);
		}
	});
}

var getQueryString = function (field, url) {
	var href = url ? url : window.location.href;
	var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
	var string = reg.exec(href);
	return string ? string[1] : null;
};

function removeTutorial() {
	$.ajax({
		url: "/api/delete-tutorial",
		method: 'post',
		data: {
			tokenId: idToken,
			tutorialID: getQueryString('id')
		},
		success: function (result) {
			console.log(result.delete);
			if (result.delete.startsWith('Succesful:')) {
				M.toast({html: result.delete});
				setTimeout(window.location.reload, 1500);
			}
		}
	});
}

function editTutorial() {
	$.ajax({
		url: "/api/check-user",
		method: 'post',
		data: {
			tokenId: idToken,
			tutorialID: getQueryString('id')
		},
		success: function (result) {
			if (result.edited) {
				M.toast({html: 'Successfully edited tutorial. Please reload to see changes'})
			}
		}
	});
}

function getTopTutorials() {
	$.ajax({
		url: "/api/get-viewed",
		method: 'post',
		success: function (res) {
			console.log(res);
			if (res) {
				for (var i = 0; i < res.tutorials.length; i++) {
					$('#viewed').append('<div class="col s12 m3">\n' +
						'                <div class="card z-depth-2 hoverable">\n' +
						'                    <div class="card-content">\n' +
						'                        <span id="title" style"margin-left: -2px" class="card-title">' + res.tutorials[i].title + '</span>\n' +
						'                        <small style="font-weight: bold; margin-top: -5px" id="author" class="grey-text text-darken-2">By ' + res.tutorials[i].author + '</small>\n' +
						'                        <p id="summary" class="grey-text text-darken-1">' + res.tutorials[i].summary + '</p>\n' +
						'                    </div>\n' +
						'                    <div class="card-action center">\n' +
						'                        <a id="link" href="tutorial?id=' + res.tutorials[i].id + '" class="btn">Tutorial</a>\n' +
						'                    </div>\n' +
						'                </div>\n' +
						'            </div>')
				}
				$('#loading-viewed').hide();

			}
		}
	});
}

function getPopTutorials() {
	$.ajax({
		url: "/api/get-pop",
		method: 'post',
		success: function (res) {
			console.log(res);
			if (res) {
				for (var i = 0; i < res.tutorials.length; i++) {
					$('#popular').append('<div class="col s12 m3">\n' +
						'                <div class="card z-depth-2 hoverable">\n' +
						'                    <div class="card-content">\n' +
						'                        <span id="title" style"margin-left: -2px" class="card-title">' + res.tutorials[i].title + '</span>\n' +
						'                        <small style="font-weight: bold; margin-top: -5px" id="author" class="grey-text text-darken-2">By ' + res.tutorials[i].author + '</small>\n' +
						'                        <p id="summary" class="grey-text text-darken-1">' + res.tutorials[i].summary + '</p>\n' +
						'                    </div>\n' +
						'                    <div class="card-action center">\n' +
						'                        <a id="link" href="tutorial?id=' + res.tutorials[i].id + '" class="btn">Tutorial</a>\n' +
						'                    </div>\n' +
						'                </div>\n' +
						'            </div>')
				}
			}
			$('#loading-pop').hide();
		}
	});
}

function getRandTutorials() {
	$.ajax({
		url: "/api/get-viewed",
		method: 'post',
		success: function (res) {
			console.log(res);
			if (res) {
				for (var i = 0; i < res.tutorials.length; i++) {
					$('#random').append('<div class="col s12 m3">\n' +
						'                <div class="card z-depth-2 hoverable">\n' +
						'                    <div class="card-content">\n' +
						'                        <span id="title" style"margin-left: -2px" class="card-title">' + res.tutorials[i].title + '</span>\n' +
						'                        <small style="font-weight: bold; margin-top: -5px" id="author" class="grey-text text-darken-2">By ' + res.tutorials[i].author + '</small>\n' +
						'                        <p id="summary" class="grey-text text-darken-1">' + res.tutorials[i].summary + '</p>\n' +
						'                    </div>\n' +
						'                    <div class="card-action center">\n' +
						'                        <a id="link" href="tutorial?id=' + res.tutorials[i].id + '" class="btn">Tutorial</a>\n' +
						'                    </div>\n' +
						'                </div>\n' +
						'            </div>')
				}
				$('#loading-rand').hide();

			}
		}
	});
}