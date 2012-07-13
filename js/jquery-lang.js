var IgeEventsLite = function () {}

IgeEventsLite.prototype.on = function (evtName, fn) {
	if (evtName && fn) {
		this.eventList[evtName] = this.eventList[evtName] || [];
		this.eventList[evtName].push(fn);
	}
}
	
IgeEventsLite.prototype.emit = function (evtName) {
	if (evtName) {
		this.eventList = this.eventList || [];
		var args = [];
		for (var i = 1; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		if (evtName) {
			var fnList = this.eventList[evtName];
			for (var i in fnList) {
				if (typeof fnList[i] == 'function') {
					fnList[i].apply(this, args);
				}
			}
		}
	}
}

var jquery_lang_js = function () {
	this.events = new IgeEventsLite();
	
	this.on = this.events.on;
	this.emit = this.events.emit;
	
	return this;
}

jquery_lang_js.prototype.lang = {};
jquery_lang_js.prototype.defaultLang;
jquery_lang_js.prototype.currentLang;

jquery_lang_js.prototype.run = function (defLang) {
	this.defaultLang = defLang;
	var langElems = $('[jql]');
	var elemsLength = langElems.length;
	
	while (elemsLength--) {
		var elem = langElems[elemsLength];
		var elemType = elem.tagName;
		if(elemType!='HTML'){
			var langElem = $(elem);
			if (langElem.is("input")) {
				// An input element
				switch (langElem.attr('type')) {
					case 'button':
					case 'submit':
						langElem.data('deftext', langElem.val());
					break;
					case 'password':
					case 'text':
						// Check for a placeholder text value
						var plText = langElem.attr('placeholder');
						if (plText) {
							langElem.data('deftext', plText);
						}
					break;
				}
			} else {
				// Not an input element
				langElem.data('deftext', langElem.html());
			}
		}
	}
	
	// Now that the language system is setup, check
	// if there is a current language and switch to it
	if (localStorage) {
		var lsLang = localStorage.getItem('langJs_currentLang');
		if (lsLang) {
			this.currentLang = lsLang;
			this.change(lsLang);
		} else {
			this.change(this.defaultLang);
		}
	} else {
		this.change(this.defaultLang);
	}
}

jquery_lang_js.prototype.loadPack = function (packPath) {
	$('<script type="text/javascript" charset="utf-8" src="' + packPath + '" />').appendTo("head");
}
	
jquery_lang_js.prototype.change = function (lang) {
	//console.log('Changing language to ' + lang);
	if (this.currentLang != lang) { this.update(lang); }
	this.currentLang = lang;
	
	// Get the page HTML
	var langElems = $('[jql]');
		
	if (this.lang[lang]) {
		var elemsLength = langElems.length;
		while (elemsLength--) {
			var elem = langElems[elemsLength];
			var langElem = $(elem);
			if (langElem.data('deftext')) {
				if (langElem.is("input")) {
					// An input element
					switch (langElem.attr('type')) {
						case 'button':
						case 'submit':
							// A button or submit, change the value attribute
							var currentText = langElem.val();
							var defaultLangText = langElem.data('deftext');
							
							var newText = this.lang[lang][defaultLangText] || currentText;
							var newHtml = currentText.replace(currentText, newText);
							langElem.val(newHtml);
						break;
						case 'password':
						case 'text':
							// Check for a placeholder text value
							var currentText = langElem.attr('placeholder');
							var defaultLangText = langElem.data('deftext');
							
							var newText = this.lang[lang][defaultLangText] || currentText;
							var newHtml = currentText.replace(currentText, newText);
							langElem.attr('placeholder', newHtml);
						break;
					}
				} else {
					// Not an input element
					var currentText = langElem.html();
					var defaultLangText = langElem.data('deftext');
					
					var newText = this.lang[lang][defaultLangText] || currentText;
					var newHtml = currentText.replace(currentText, newText);
					langElem.html(newHtml);
				}
			} else {
				//console.log('No language data for element... have you executed .run() first?');
			}
		}
	} else {
		console.log('Cannot switch language, no language pack defined for "' + lang + '"');
	}
}

jquery_lang_js.prototype.convert = function (text, lang) {
	if (lang) {
		return this.lang[lang][text];
	} else {
		return this.lang[this.currentLang][text];
	}
}

jquery_lang_js.prototype.update = function (lang) {
	if (localStorage) {
		localStorage.setItem('langJs_currentLang', lang);
	}
	this.emit('update', lang);
}
