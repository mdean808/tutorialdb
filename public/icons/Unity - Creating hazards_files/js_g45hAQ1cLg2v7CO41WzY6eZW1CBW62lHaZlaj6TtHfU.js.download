/* ====================================================
 * Company: Unity Technologies
 * Author:  Rickard Andersson, rickard@unity3d.com
======================================================= */

$(document).on('ready',function(){

  window.unityLearnLessonYoutubePlayer = undefined;

  // Frontpage tabs
  var hash = location.hash.split('#')[1];
  $((hash != undefined) ? '.tabs li a[data-tab="'+ hash +'-section"]' : '.tabs li:first-child a').trigger('click');


  // Playlist page
  if($('.g12.has-banner').size() > 0){
    $('.g12.has-banner').parent().addClass('has-banner');
  }


  // Expand/collapse sidebar playlists
  
  if($('.lesson-sidebar ol').size() > 0){
    
    $('.lesson-sidebar ol').each(function(i,ol){
      
      if($('li.current',this).size() == 0){
        $(this).hide();
        $(this).prev('.list-header').find('a').addClass('expand');
      }
      else {
        $(this).prev('.list-header').find('a').addClass('expand expanded');
      }
      
    });

    $('.lesson-sidebar a.expand').on('click',function(e){
      
      var $this = $(this),
          $list = $this.parent().next('ol');
      
      if($this.hasClass('expanded')){
        $this.removeClass('expanded');
        $list.hide();
      }
      else {
        $this.addClass('expanded');
        $list.show();
      }

    });


  }


  // Expand show reel and play video
  $('.tutorial-video .video-cover').on('click',function(e){

    var $this = $(this),
        $poster = $this.parent().find('.poster'),
        seek = $this.data('seek');
        videoId = $this.data('videoId');

    $this.css('opacity',0);
    $poster.css('opacity',0);

    window.unityLearnLessonYoutubePlayer = new YT.Player("player", {
      videoId: videoId,
      events: {
        'onReady': function (event) {
          event.target.playVideo();
          if (seek) {
            event.target.seekTo(seek);
            $(window).scrollTop($('#player').offset().top - 50);
          }
        }
      }
    });

    // Force iframe to fill up
    setTimeout(function(){
    },2150);

  })

  $('.transcripts .expand').on('click',function(e) {
    $('.transcripts .timeline').toggleClass('hide');
  });

  $(".timecode a").click(function(event) {
    if (window.unityLearnLessonYoutubePlayer === undefined) {
      $('.tutorial-video .video-cover').data('seek', $(this).attr('class'));
      $('.tutorial-video .video-cover').trigger('click');
    }
    else {
      unityLearnLessonYoutubePlayer.playVideo();
      unityLearnLessonYoutubePlayer.seekTo($(this).attr('class'));
      $(window).scrollTop($('#player').offset().top - 50);
    }
    return false;
  });
  
//  in article video player 
//  Usage = <div class="player" data-video="{Youtube video ID}"></div>

$('.player').each(function(index, el){
  var videoID = el.dataset.video;
  var videoWrapper = document.createElement('div');
  var videoIframe = document.createElement('iframe');

  $(videoWrapper).addClass('player_wrapper');
  $(videoIframe).attr('src', 'https://www.youtube.com/embed/' + videoID + '?autohide=1&disablekb=1&iv_load_policy=3&rel=0&modestbranding=1&enablejsapi=1&showinfo=0/html5=1&loop=1');
  $(videoWrapper).append(videoIframe);

  $(this).append(videoWrapper);
})


});
;
/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

(function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
	util: {
		type: function (o) { 
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},
		
		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};
					
					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}
					
					return clone;
					
				case 'Array':
					return o.slice();
			}
			
			return o;
		}
	},
	
	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);
			
			for (var key in redef) {
				lang[key] = redef[key];
			}
			
			return lang;
		},
		
		// Insert a token before another token in a language literal
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];
			var ret = {};
				
			for (var token in grammar) {
			
				if (grammar.hasOwnProperty(token)) {
					
					if (token == before) {
					
						for (var newToken in insert) {
						
							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}
					
					ret[token] = grammar[token];
				}
			}
			
			return root[inside] = ret;
		},
		
		// Traverse a language definition with Depth First Search
		DFS: function(o, callback) {
			for (var i in o) {
				callback.call(o, i, o[i]);
				
				if (_.util.type(o) === 'Object') {
					_.languages.DFS(o[i], callback);
				}
			}
		}
	},

	highlightAll: function(async, callback) {
		var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, callback);
		}
	},
		
	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;
		
		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}
		
		if (parent) {
			language = (parent.className.match(lang) || [,''])[1];
			grammar = _.languages[language];
		}

		if (!grammar) {
			return;
		}
		
		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
		
		// Set language on the parent, for styling
		parent = element.parentNode;
		
		if (/pre/i.test(parent.nodeName)) {
			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language; 
		}

		var code = element.textContent;
		
		if(!code) {
			return;
		}
		
		code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
		           .replace(/>/g, '&gt;').replace(/\u00a0/g, ' ');
		//console.time(code.slice(0,50));
		
		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};
		
		_.hooks.run('before-highlight', env);
		
		if (async && self.Worker) {
			var worker = new Worker(_.filename);	
			
			worker.onmessage = function(evt) {
				env.highlightedCode = Token.stringify(JSON.parse(evt.data));
				env.element.innerHTML = env.highlightedCode;
				
				callback && callback.call(env.element);
				//console.timeEnd(code.slice(0,50));
				_.hooks.run('after-highlight', env);
			};
			
			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar)
			env.element.innerHTML = env.highlightedCode;
			
			callback && callback.call(element);
			
			_.hooks.run('after-highlight', env);
			//console.timeEnd(code.slice(0,50));
		}
	},
	
	highlight: function (text, grammar) {
		return Token.stringify(_.tokenize(text, grammar));
	},
	
	tokenize: function(text, grammar) {
		var Token = _.Token;
		
		var strarr = [text];
		
		var rest = grammar.rest;
		
		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}
			
			delete grammar.rest;
		}
								
		tokenloop: for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}
			
			var pattern = grammar[token], 
				inside = pattern.inside,
				lookbehind = !!pattern.lookbehind || 0;
			
			pattern = pattern.pattern || pattern;
			
			for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop
				
				var str = strarr[i];
				
				if (strarr.length > text.length) {
					// Something went terribly wrong, ABORT, ABORT!
					break tokenloop;
				}
				
				if (str instanceof Token) {
					continue;
				}
				
				pattern.lastIndex = 0;
				
				var match = pattern.exec(str);
				
				if (match) {
					if(lookbehind) {
						lookbehind = match[1].length;
					}

					var from = match.index - 1 + lookbehind,
					    match = match[0].slice(lookbehind),
					    len = match.length,
					    to = from + len,
						before = str.slice(0, from + 1),
						after = str.slice(to + 1); 

					var args = [i, 1];
					
					if (before) {
						args.push(before);
					}
					
					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);
					
					args.push(wrapped);
					
					if (after) {
						args.push(after);
					}
					
					Array.prototype.splice.apply(strarr, args);
				}
			}
		}

		return strarr;
	},
	
	hooks: {
		all: {},
		
		add: function (name, callback) {
			var hooks = _.hooks.all;
			
			hooks[name] = hooks[name] || [];
			
			hooks[name].push(callback);
		},
		
		run: function (name, env) {
			var callbacks = _.hooks.all[name];
			
			if (!callbacks || !callbacks.length) {
				return;
			}
			
			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content) {
	this.type = type;
	this.content = content;
};

Token.stringify = function(o) {
	if (typeof o == 'string') {
		return o;
	}
	
	if (Object.prototype.toString.call(o) == '[object Array]') {
		return o.map(Token.stringify).join('');
	}
	
	var env = {
		type: o.type,
		content: Token.stringify(o.content),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {}
	};
	
	if (env.type == 'comment') {
		env.attributes['spellcheck'] = 'true';
	}
	
	_.hooks.run('wrap', env);
	
	var attributes = '';
	
	for (var name in env.attributes) {
		attributes += name + '="' + (env.attributes[name] || '') + '"';
	}
	
	return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	
};

if (!self.document) {
	// In worker
	self.addEventListener('message', function(evt) {
		var message = JSON.parse(evt.data),
		    lang = message.language,
		    code = message.code;
		
		self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
		self.close();
	}, false);
	
	return;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
	_.filename = script.src;
	
	if (document.addEventListener && !script.hasAttribute('data-manual')) {
		document.addEventListener('DOMContentLoaded', _.highlightAll);
	}
}

})();;
Prism.languages.clike = {
	'comment': {
		pattern: /(^|[^\\])(\/\*[\w\W]*?\*\/|\/\/.*?(\r?\n|$))/g,
		lookbehind: true
	},
	'string': /("|')(\\?.)*?\1/g,
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|catch|finally|null|break|continue)\b/g,
	'boolean': /\b(true|false)\b/g,
	'number': /\b-?(0x)?\d*\.?[\da-f]+\b/g,
	'operator': /[-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g,
	'ignore': /&(lt|gt|amp);/gi,
	'punctuation': /[{}[\];(),.:]/g
};;
Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(var|let|if|else|while|do|for|return|in|instanceof|function|new|with|typeof|try|catch|finally|null|break|continue)\b/g,
	'number': /\b(-?(0x)?\d*\.?[\da-f]+|NaN|-?Infinity)\b/g,
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\r\n])+\/[gim]{0,3}(?=\s*($|[\r\n,.;})]))/g,
		lookbehind: true
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)[\w\W]*?(&lt;|<)\/script(>|&gt;)/ig,
			inside: {
				'tag': {
					pattern: /(&lt;|<)script[\w\W]*?(>|&gt;)|(&lt;|<)\/script(>|&gt;)/ig,
					inside: Prism.languages.markup.tag.inside
				},
				rest: Prism.languages.javascript
			}
		}
	});
};
Prism.languages.java = Prism.languages.extend('clike', {
	'keyword': /\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/g,
	'number': /\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+[e]?[\d]*[df]\b|\W\d*\.?\d+\b/gi,
	'operator': {
		pattern: /([^\.]|^)([-+]{1,2}|!|=?&lt;|=?&gt;|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\/|%|\^|(&lt;){2}|($gt;){2,3}|:|~)/g,
		lookbehind: true
	}
});;
(function(){

if(!window.Prism) {
	return;
}

function $$(expr, con) {
	return Array.prototype.slice.call((con || document).querySelectorAll(expr));
}

var CRLF = crlf = /\r?\n|\r/g;
    
function highlightLines(pre, lines, classes) {
	var ranges = lines.replace(/\s+/g, '').split(','),
	    offset = +pre.getAttribute('data-line-offset') || 0;
	
	var lineHeight = parseFloat(getComputedStyle(pre).lineHeight);

	for (var i=0, range; range = ranges[i++];) {
		range = range.split('-');
					
		var start = +range[0],
		    end = +range[1] || start;
		
		var line = document.createElement('div');
		
		line.textContent = Array(end - start + 2).join(' \r\n');
		line.className = (classes || '') + ' line-highlight';
		line.setAttribute('data-start', start);
		
		if(end > start) {
			line.setAttribute('data-end', end);
		}
	
		line.style.top = (start - offset - 1) * lineHeight + 'px';
		
		(pre.querySelector('code') || pre).appendChild(line);
	}
}

function applyHash() {
	var hash = location.hash.slice(1);
	
	// Remove pre-existing temporary lines
	$$('.temporary.line-highlight').forEach(function (line) {
		line.parentNode.removeChild(line);
	});
	
	var range = (hash.match(/\.([\d,-]+)$/) || [,''])[1];
	
	if (!range || document.getElementById(hash)) {
		return;
	}
	
	var id = hash.slice(0, hash.lastIndexOf('.')),
	    pre = document.getElementById(id);
	    
	if (!pre) {
		return;
	}
	
	if (!pre.hasAttribute('data-line')) {
		pre.setAttribute('data-line', '');
	}

	highlightLines(pre, range, 'temporary ');

	document.querySelector('.temporary.line-highlight').scrollIntoView();
}

var fakeTimer = 0; // Hack to limit the number of times applyHash() runs

Prism.hooks.add('after-highlight', function(env) {
	var pre = env.element.parentNode;
	var lines = pre && pre.getAttribute('data-line');
	
	if (!pre || !lines || !/pre/i.test(pre.nodeName)) {
		return;
	}
	
	clearTimeout(fakeTimer);
	
	$$('.line-highlight', pre).forEach(function (line) {
		line.parentNode.removeChild(line);
	});
	
	highlightLines(pre, lines);
	
	fakeTimer = setTimeout(applyHash, 1);
});

addEventListener('hashchange', applyHash);

})();;
(function(){

var url = /\b([a-z]{3,7}:\/\/|tel:)[\w-+%~/.]+/,
    email = /\b\S+@[\w.]+[a-z]{2}/,
    linkMd = /\[([^\]]+)]\(([^)]+)\)/,
    
	// Tokens that may contain URLs and emails
    candidates = ['comment', 'url', 'attr-value', 'string'];

for (var language in Prism.languages) {
	var tokens = Prism.languages[language];
	
	Prism.languages.DFS(tokens, function (type, def) {
		if (candidates.indexOf(type) > -1) {
			if (!def.pattern) {
				def = this[type] = {
					pattern: def
				};
			}
			
			def.inside = def.inside || {};
			
			if (type == 'comment') {
				def.inside['md-link'] = linkMd;
			}
			
			def.inside['url-link'] = url;
			def.inside['email-link'] = email;
		}
	});
	
	tokens['url-link'] = url;
	tokens['email-link'] = email;
}

Prism.hooks.add('wrap', function(env) {
	if (/-link$/.test(env.type)) {
		env.tag = 'a';
		
		var href = env.content;
		
		if (env.type == 'email-link') {
			href = 'mailto:' + href;
		}
		else if (env.type == 'md-link') {
			// Markdown
			var match = env.content.match(linkMd);
			
			href = match[2];
			env.content = match[1];
		}
		
		env.attributes.href = href;
	}
});

})();;
;
/**
 * Plugin to add line numbers
 * 
 * To add line numbers to a highlighted code block
 * just add the attr data-linenums="1" to the pre element that
 * wraps the code block.
 * You can also set the starting line number by adding the attr
 * data-linenums-start="[YOUR STARTING NUMBER]" to the pre element
 *
 * @important THE show-invisibles PLUGIN IS REQUIRED FOR THIS PLUGIN TO WORK PROPERLY
 * 
 * @example <pre data-linenums="1"><code>[YOUR CODE]</code></pre>
 * @example <pre data-linenums="1" data-linenums-start="13"><code>[YOUR CODE]</code></pre>
 * 
 * @author Justin Carlson <env.justin@gmail.com>
 * @created 12/16/2012
 * 
 * @see https://github.com/LeaVerou/prism/pull/64/files
 */
(function(){
  if(!window.Prism) {
    return;
  }

  var enabled = false;
  var lineNum = null;
  var start = null;
  
  // Create line number div
  var div = document.createElement('div');
  div.className = "linenumWrap";
  
  
  Prism.hooks.add('before-highlight', function(env) {

    // enabled = env.element.parentNode.getAttribute('data-linenums');
    enabled = true;
    
    // Check is line numbering is enabled
    if(enabled) {
      
      div.innerHTML = '';
      // Get the starting line number
      start = env.element.parentNode.getAttribute('data-linenums-start');
      // we start it a line 2 since line 1 will be added after-highlight
      lineNum = start ? start : 1;
      
    }
  });
  
  // Make sure the first and last line is numbered
  Prism.hooks.add('after-highlight', function(env) {
    if(enabled) {
      var match = env.code.match(/\r\n|\r|\n/g);
      var count = match ? match.length : 0;
      for(var i=0; i<count; i++) {
        div.innerHTML += '<div class="linenum">' + (++lineNum) + '</div>';
      }
      
      start = start ? start : 1;
      div.innerHTML = '<div class="linenum">' + start + '</div>' + div.innerHTML ;
      env.element.parentNode.appendChild(div.cloneNode(true));
    }
  });

})();;

// todo KeyCode.C
// todo var positionA : Vector3 = new Vector3(-5, 3, 0);

var classes = "(Input|KeyCode|Time|KeyCode|Vector3|Color|MonoBehaviour|Mathf)";
Prism.languages.unity = Prism.languages.extend('java', {
  'docs-static': new RegExp("(" + classes + "\\.[A-Z][a-zA-Z0-9]+)", "g"),
  'docs-instance': new RegExp("(" + classes + "\\.[a-z][a-zA-Z0-9]+)", "g"),
  'punctuation': false
});

// Unity Languages
Prism.languages.csharp = Prism.languages.extend('unity', {
  'keyword': /\b(abstract|event|new|struct|as|explicit|null|switch|base|extern|object|this|bool|false|operator|throw|break|finally|out|true|byte|fixed|override|try|case|float|params|typeof|catch|for|private|uint|char|foreach|protected|ulong|checked|goto|public|unchecked|class|if|readonly|unsafe|const|implicit|ref|ushort|continue|in|return|using|decimal|int|sbyte|virtual|default|interface|sealed|volatile|delegate|internal|short|void|do|is|sizeof|while|double|lock|stackalloc|else|long|static|enum|namespace|string)\b/g
});

Prism.languages.boo = Prism.languages.extend('unity', {
  'keyword': /\b(abstract|and|as|AST|break|callable|cast|char|class|constructor|continue|def|destructor|do|elif|else|ensure|enum|event|except|failure|final|from|for|false|get|given|goto|if|import|in|interface|internal|is|isa|not|null|of|or|otherwise|override|namespace|partial|pass|public|protected|private|raise|ref|retry|return|self|set|super|static|struct|success|transient|true|try|typeof|unless|virtual|when|while|yield)\b/g
});

Prism.languages.js = Prism.languages.extend('unity', {
  'keyword': /\b(as|boolean|break|byte|case|catch|char|class|continue|default|double|else|enum|extends|finally|float|for|function|if|import|in|instanceof|int|long|new|null|private|protected|public|return|short|static|super|switch|this|throw|try|typeof|var|while)\b/g
});

Prism.languages.shaderLab = Prism.languages.extend('clike', {
  'keyword': /\b(Shader|SubShader|Properties|Pass|Fallback|CustomEditor|Tags|CGPROGRAM|ENDCG|#pragma|struct|return)\b/g,
  'boolean': /\b(On|Off)\b/g,
  'punctuation': false
});

Prism.hooks.add('wrap', function(env) {
  if (env.type == 'docs-static') {
    env.content = '<a href="http://docs.unity3d.com/Documentation/ScriptReference/' + env.content + '.html" target="_blank">' + env.content + '</a>';
  } else if(env.type == 'docs-instance') {
    var ref = env.content.replace(/\./, '-')
    env.content = '<a href="http://docs.unity3d.com/Documentation/ScriptReference/' + ref + '.html" target="_blank">' + env.content + '</a>';
  }
});

$(document).on('ready',function(){

  function prismLanguageClassToName(klass) {
    switch(klass) {
      case 'language-js': return 'JS';
      case 'language-csharp': return 'C#';
      case 'language-boo': return 'Boo';
      case 'language-shaderLab': return 'ShaderLab';
    }
  }

  // Multi tabbed code highlighting
  $('div.code-snippet').each(function(key) {
    var nr = parseInt(key) + 1; 
    var tabs = '', $this = $(this), $codes = $this.find('pre[class^="language-"]');

    if($codes.length == 0) return;

    var classes = [];
    $codes.each(function() {
      classes.push($(this).attr('class'));
    });

    tabs  = '<ul class="tabs">';
    for(i in classes) {
      tabs += '<li><a href="#' + classes[i] + '" data-show="pre.' + classes[i] + '" data-hide=".code-snippet pre" class="lang-'+ prismLanguageClassToName(classes[i]).replace('#','').toLowerCase() +'">' + prismLanguageClassToName(classes[i]) + '</a></li>';
    }
    tabs += '</ul>';

    $this.prepend($(tabs));
    $this.prepend('<div class="copy action tooltip" data-distance="-40|-30|top"><span class="ico-copy"></span><div class="tip">Copy code</div></div>');

    if(parseInt($('pre',$this).css('height')) > 260){
      $this.prepend('<div class="exp action tooltip" data-distance="-40|-30|top"><span class="ico-resize-full-screen"></span><div class="tip">Expand view</div></div>');
      $this.prepend('<div class="col action tooltip hide" data-distance="-40|-30|top"><span class="ico-resize-100"></span><div class="tip">Collapse view</div></div>');
    }
  });

  // Custom tabs
  $('.code-snippet li a').click(function(e) {
    e.preventDefault();

    var languageClass = $(this).attr('class').split(' ')[0];
    $('.code-snippet li a.selected').removeClass('selected');
    $('.code-snippet li a.' + languageClass).addClass('selected');

    $($(this).attr('data-hide')).hide();
    $($(this).attr('data-show')).show();

    $.cookie('learn-prefered-code-lang', 'lang-' + $(this).text().replace('#',''), { expires: 7 });

  });

  // Preselect the first code example
  ($.cookie('learn-prefered-code-lang') == null) ? $('.code-snippet li:first a').click() : $('.code-snippet li a.' + $.cookie('learn-prefered-code-lang').replace('#','').toLowerCase()).click();

  // Copy code functions
  var theMoviePath = window.location.protocol + "//" + window.location.host + Drupal.settings.basePath + 'profiles/unity3d/themes/unity/resources/ZeroClipboard.swf';
  var clip = new ZeroClipboard($('.code-snippet .copy'), { moviePath: theMoviePath });
  clip.on('mousedown', function(){
    $('span',this).addClass('active');
  });
  clip.on('mouseup', function(){
    $('span',this).removeClass('active');
    var $snippet = $(this).parent();
    var selector = $('.tabs li a.selected', $snippet).attr('data-show');
    clip.setText($(selector + ' code', $snippet).text());
  });
  clip.on('mouseover', function(client){
    var d = $(this).attr('data-distance').split('|');
    $('.tip', $(this)).css('top',d[0]+'px');
    (d[2] == 'top') ? $('.tip', $(this)).addClass('t') : $('.tip', $(this)).addClass('b');
    $('.tip', $(this)).addClass('tip-visible');
    $(this).find('.tip').stop(true, true).removeClass('hide').animate({ 'top': d[1], 'opacity': 1 }, 200 );
  });
  clip.on('mouseout', function(client){
    var d = $(this).attr('data-distance').split('|');
    $(this).find('.tip').stop(true, false).animate({ 'top': d[0], 'opacity': 0 }, 200, function(){
      $(this).addClass('hide');
    });
  });

  // Multi tabbed code highlighting
  $('.code-snippet').on('click', '.exp', function(){
    $(this).parent().find('pre').css('max-height', 'none');
    $(this).parent().find('.col').removeClass('hide');
    $(this).addClass('hide');
  });
  // Multi tabbed code highlighting
  $('.code-snippet').on('click', '.col', function(){
    $(this).parent().find('pre').css('max-height', '20em');
    $(this).parent().find('.exp').removeClass('hide');
    $(this).addClass('hide');
  });

});
;
/*!
 * zeroclipboard
 * The Zero Clipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie, and a JavaScript interface.
 * Copyright 2012 Jon Rohan, James M. Greene, .
 * Released under the MIT license
 * http://jonrohan.github.com/ZeroClipboard/
 * v1.1.7
 */
(function(){"use strict";var a=function(a,b){var c=a.style[b];a.currentStyle?c=a.currentStyle[b]:window.getComputedStyle&&(c=document.defaultView.getComputedStyle(a,null).getPropertyValue(b));if(c=="auto"&&b=="cursor"){var d=["a"];for(var e=0;e<d.length;e++)if(a.tagName.toLowerCase()==d[e])return"pointer"}return c},b=function(a){if(!l.prototype._singleton)return;a||(a=window.event);var b;this!==window?b=this:a.target?b=a.target:a.srcElement&&(b=a.srcElement),l.prototype._singleton.setCurrent(b)},c=function(a,b,c){a.addEventListener?a.addEventListener(b,c,!1):a.attachEvent&&a.attachEvent("on"+b,c)},d=function(a,b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.detachEvent&&a.detachEvent("on"+b,c)},e=function(a,b){if(a.addClass)return a.addClass(b),a;if(b&&typeof b=="string"){var c=(b||"").split(/\s+/);if(a.nodeType===1)if(!a.className)a.className=b;else{var d=" "+a.className+" ",e=a.className;for(var f=0,g=c.length;f<g;f++)d.indexOf(" "+c[f]+" ")<0&&(e+=" "+c[f]);a.className=e.replace(/^\s+|\s+$/g,"")}}return a},f=function(a,b){if(a.removeClass)return a.removeClass(b),a;if(b&&typeof b=="string"||b===undefined){var c=(b||"").split(/\s+/);if(a.nodeType===1&&a.className)if(b){var d=(" "+a.className+" ").replace(/[\n\t]/g," ");for(var e=0,f=c.length;e<f;e++)d=d.replace(" "+c[e]+" "," ");a.className=d.replace(/^\s+|\s+$/g,"")}else a.className=""}return a},g=function(b){var c={left:0,top:0,width:b.width||b.offsetWidth||0,height:b.height||b.offsetHeight||0,zIndex:9999},d=a(b,"zIndex");d&&d!="auto"&&(c.zIndex=parseInt(d,10));while(b){var e=parseInt(a(b,"borderLeftWidth"),10),f=parseInt(a(b,"borderTopWidth"),10);c.left+=isNaN(b.offsetLeft)?0:b.offsetLeft,c.left+=isNaN(e)?0:e,c.top+=isNaN(b.offsetTop)?0:b.offsetTop,c.top+=isNaN(f)?0:f,b=b.offsetParent}return c},h=function(a){return(a.indexOf("?")>=0?"&":"?")+"nocache="+(new Date).getTime()},i=function(a){var b=[];return a.trustedDomains&&(typeof a.trustedDomains=="string"?b.push("trustedDomain="+a.trustedDomains):b.push("trustedDomain="+a.trustedDomains.join(","))),b.join("&")},j=function(a,b){if(b.indexOf)return b.indexOf(a);for(var c=0,d=b.length;c<d;c++)if(b[c]===a)return c;return-1},k=function(a){if(typeof a=="string")throw new TypeError("ZeroClipboard doesn't accept query strings.");return a.length?a:[a]},l=function(a,b){a&&(l.prototype._singleton||this).glue(a);if(l.prototype._singleton)return l.prototype._singleton;l.prototype._singleton=this,this.options={};for(var c in o)this.options[c]=o[c];for(var d in b)this.options[d]=b[d];this.handlers={},l.detectFlashSupport()&&p()},m,n=[];l.prototype.setCurrent=function(b){m=b,this.reposition(),b.getAttribute("title")&&this.setTitle(b.getAttribute("title")),this.setHandCursor(a(b,"cursor")=="pointer")},l.prototype.setText=function(a){a&&a!==""&&(this.options.text=a,this.ready()&&this.flashBridge.setText(a))},l.prototype.setTitle=function(a){a&&a!==""&&this.htmlBridge.setAttribute("title",a)},l.prototype.setSize=function(a,b){this.ready()&&this.flashBridge.setSize(a,b)},l.prototype.setHandCursor=function(a){this.ready()&&this.flashBridge.setHandCursor(a)},l.version="1.1.7";var o={moviePath:"ZeroClipboard.swf",trustedDomains:null,text:null,hoverClass:"zeroclipboard-is-hover",activeClass:"zeroclipboard-is-active",allowScriptAccess:"sameDomain"};l.setDefaults=function(a){for(var b in a)o[b]=a[b]},l.destroy=function(){l.prototype._singleton.unglue(n);var a=l.prototype._singleton.htmlBridge;a.parentNode.removeChild(a),delete l.prototype._singleton},l.detectFlashSupport=function(){var a=!1;try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash")&&(a=!0)}catch(b){navigator.mimeTypes["application/x-shockwave-flash"]&&(a=!0)}return a};var p=function(){var a=l.prototype._singleton,b=document.getElementById("global-zeroclipboard-html-bridge");if(!b){var c='      <object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="global-zeroclipboard-flash-bridge" width="100%" height="100%">         <param name="movie" value="'+a.options.moviePath+h(a.options.moviePath)+'"/>         <param name="allowScriptAccess" value="'+a.options.allowScriptAccess+'"/>         <param name="scale" value="exactfit"/>         <param name="loop" value="false"/>         <param name="menu" value="false"/>         <param name="quality" value="best" />         <param name="bgcolor" value="#ffffff"/>         <param name="wmode" value="transparent"/>         <param name="flashvars" value="'+i(a.options)+'"/>         <embed src="'+a.options.moviePath+h(a.options.moviePath)+'"           loop="false" menu="false"           quality="best" bgcolor="#ffffff"           width="100%" height="100%"           name="global-zeroclipboard-flash-bridge"           allowScriptAccess="always"           allowFullScreen="false"           type="application/x-shockwave-flash"           wmode="transparent"           pluginspage="http://www.macromedia.com/go/getflashplayer"           flashvars="'+i(a.options)+'"           scale="exactfit">         </embed>       </object>';b=document.createElement("div"),b.id="global-zeroclipboard-html-bridge",b.setAttribute("class","global-zeroclipboard-container"),b.setAttribute("data-clipboard-ready",!1),b.style.position="absolute",b.style.left="-9999px",b.style.top="-9999px",b.style.width="15px",b.style.height="15px",b.style.zIndex="9999",b.innerHTML=c,document.body.appendChild(b)}a.htmlBridge=b,a.flashBridge=document["global-zeroclipboard-flash-bridge"]||b.children[0].lastElementChild};l.prototype.resetBridge=function(){this.htmlBridge.style.left="-9999px",this.htmlBridge.style.top="-9999px",this.htmlBridge.removeAttribute("title"),this.htmlBridge.removeAttribute("data-clipboard-text"),f(m,this.options.activeClass),m=null,this.options.text=null},l.prototype.ready=function(){var a=this.htmlBridge.getAttribute("data-clipboard-ready");return a==="true"||a===!0},l.prototype.reposition=function(){if(!m)return!1;var a=g(m);this.htmlBridge.style.top=a.top+"px",this.htmlBridge.style.left=a.left+"px",this.htmlBridge.style.width=a.width+"px",this.htmlBridge.style.height=a.height+"px",this.htmlBridge.style.zIndex=a.zIndex+1,this.setSize(a.width,a.height)},l.dispatch=function(a,b){l.prototype._singleton.receiveEvent(a,b)},l.prototype.on=function(a,b){var c=a.toString().split(/\s/g);for(var d=0;d<c.length;d++)a=c[d].toLowerCase().replace(/^on/,""),this.handlers[a]||(this.handlers[a]=b);this.handlers.noflash&&!l.detectFlashSupport()&&this.receiveEvent("onNoFlash",null)},l.prototype.addEventListener=l.prototype.on,l.prototype.off=function(a,b){var c=a.toString().split(/\s/g);for(var d=0;d<c.length;d++){a=c[d].toLowerCase().replace(/^on/,"");for(var e in this.handlers)e===a&&this.handlers[e]===b&&delete this.handlers[e]}},l.prototype.removeEventListener=l.prototype.off,l.prototype.receiveEvent=function(a,b){a=a.toString().toLowerCase().replace(/^on/,"");var c=m;switch(a){case"load":if(b&&parseFloat(b.flashVersion.replace(",",".").replace(/[^0-9\.]/gi,""))<10){this.receiveEvent("onWrongFlash",{flashVersion:b.flashVersion});return}this.htmlBridge.setAttribute("data-clipboard-ready",!0);break;case"mouseover":e(c,this.options.hoverClass);break;case"mouseout":f(c,this.options.hoverClass),this.resetBridge();break;case"mousedown":e(c,this.options.activeClass);break;case"mouseup":f(c,this.options.activeClass);break;case"datarequested":var d=c.getAttribute("data-clipboard-target"),g=d?document.getElementById(d):null;if(g){var h=g.value||g.textContent||g.innerText;h&&this.setText(h)}else{var i=c.getAttribute("data-clipboard-text");i&&this.setText(i)}break;case"complete":this.options.text=null}if(this.handlers[a]){var j=this.handlers[a];typeof j=="function"?j.call(c,this,b):typeof j=="string"&&window[j].call(c,this,b)}},l.prototype.glue=function(a){a=k(a);for(var d=0;d<a.length;d++)j(a[d],n)==-1&&(n.push(a[d]),c(a[d],"mouseover",b))},l.prototype.unglue=function(a){a=k(a);for(var c=0;c<a.length;c++){d(a[c],"mouseover",b);var e=j(a[c],n);e!=-1&&n.splice(e,1)}},typeof module!="undefined"?module.exports=l:typeof define=="function"&&define.amd?define(function(){return l}):window.ZeroClipboard=l})();;
/*
 *  Copyright (c) 2012 Alex Pankratov. All rights reserved.
 *  http://swapped.cc/gif-player
 *
 *  This code is distributed under terms of BSD license. 
 *  You can obtain the copy of the license by visiting: http://www.opensource.org/licenses/bsd-license.php
 */

$(document).on('ready',function(){

  $('.gif-player').each(function(){

    function swapWithFade(i1,i2,done) {
      i1.fadeOut('fast', function(){ 
        i2.fadeIn('fast',done);
      });
    }

    var self = $(this);
    this.gp = new gifPlayer(self, {
      play: swapWithFade,
      stop: swapWithFade });
  });

});

function gifPlayer(cont, opts) {

  /* 
   *  parameters
   */
  var defaults = {
    autoplay: true,
    play:     function(s, m, cb) { s.hide(); m.show(); cb(); },
    stop:     function(m, s, cb) { m.hide(); s.show(); cb(); }
  };

  var opts = $.extend({}, defaults, opts);
  
  /*
   *  variables
   */
  var c = cont;
  var s = cont.find('.gif-still');
  var m = cont.find('.gif-movie');

  var state = 'e';
  var busy = false;

  var i = new Image;

  /* 
   *  functions
   */
  var setState = function(was, now) {
    c.removeClass('gp-' + was);
    c.addClass('gp-' + now);
    state = now;
  }

  var play = opts['play'];
  var stop = opts['stop'];
  var done = function() { busy = false; }

  /* 
   *  click() handler
   */
  this.act = function()
  {
    if (busy)
      return;

    switch (state)
    {

    case 'e': /* empty, ready to load */

      setState('e', 'l');
      m.load(function(){ 

        i.src = m.attr('src');
        m.unbind('load');

        if (! opts['autoplay'])
        {
          setState('l','s');
          return;
        }

        setState('l','p');
        busy = true;
        play(s, m, done);
      });
      m.attr('src', m.attr('data-gif'));
      break;

    case 'l': /* loading... */

      setState('l', 'e');
      m.unbind('load');
      m.attr('src', '');
      break;

    case 's': /* stopped, ready to play */

      /* this rewinds the gif, not in all browsers */
      m.attr('src', null).attr('src', i.src);

      setState('s', 'p');
      busy = true;
      play(s, m, done);
      break;
    
    case 'p': /* playing... */

      setState('p', 's');
      busy = true;
      stop(m, s, done);
      break;
    }
  }
  
  /*
   *  initialization
   */
  var that = this;

  c.find('.controls').click( function(){ that.act(); });
  c.addClass('gp-e');
  m.hide(); s.show();

}
;
