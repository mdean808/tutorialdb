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
			$('#edit').show();
            document.getElementById('g-signIn').style.display = 'none';
			document.getElementById('g-signIn1').style.display = 'none';
            document.getElementById('logged-in').style.display = 'block';
			document.getElementById('nav-logged-in').style.display = 'block';
            document.getElementById('new-tutorial').style.display = 'block';
            document.getElementById('login-dropdown').style.display = 'block';
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
        success: function(result1) {
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
        error: function(result, err) {
            console.log("err", err);
            console.log(result);
			$('#loading').remove();
        }
    });
}

function text() {
    $.ajax({
        method: 'post',
        url: '/api/set-text',
        success: function(result) {
            console.log(result)
        },
        error: function (result, err) {
            console.log('Error', err, 'at: ', result)
        }
    })
}

function loadTutorial() {
    $.ajax({
        method: 'post',
        url: "/api/get-tutorial?id=" + getQueryString('id'),
        success: function(result1) {
            var tutorial = result1.tutorialResults[0];
            document.getElementById('tutorial-title').innerHTML = tutorial.title;
            document.getElementById('creator-name').innerHTML = tutorial.author;
            // noinspection JSUnresolvedVariable
			document.getElementById('tutorial-desc').innerHTML = new showdown.Converter().makeHtml(tutorial.description);
            document.getElementById('tutorial-link').outerHTML = "<a href='" + tutorial.link + "'>" + tutorial.link + "</a>";
        },
        error: function(result, err) {
            console.log("err", err);
            console.log(result);
        }
    });
}

var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
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
        success: function(result){
            console.log(result);
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
		success: function(result){
			if (result.edited) {
			    M.toast({html: 'Successfully edited tutorial. Please reload to see changes'})
            }
		}
	});
}