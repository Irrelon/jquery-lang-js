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
jquery_lang_js.prototype.defaultLang = 'en';
jquery_lang_js.prototype.currentLang = 'en';

jquery_lang_js.prototype.run = function () {
	var langElems = $('[lang]');
	var elemsLength = langElems.length;
	
	while (elemsLength--) {
		var elem = langElems[elemsLength];
		var langElem = $(elem);
		
		if (langElem.attr('lang') == this.defaultLang) {
			langElem.data('deftext', langElem.html());
		}
	}
	
	this.change(this.currentLang);
}

jquery_lang_js.prototype.loadPack = function (packPath) {
	$('<script type="text/javascript" charset="utf-8" src="' + packPath + '" />').appendTo("head");
}
	
jquery_lang_js.prototype.change = function (lang) {
	//console.log('Changing language to ' + lang);
	if (this.currentLang != lang) { this.update(lang); }
	this.currentLang = lang;
	
	// Get the page HTML
	var langElems = $('[lang]');
	
	if (lang != this.defaultLang) {
		var elemsLength = langElems.length;
		while (elemsLength--) {
			var elem = langElems[elemsLength];
			var langElem = $(elem);
			if (langElem.data('deftext')) {
				var currentText = langElem.html();
				var englishText = langElem.data('deftext');
				var newText = this.lang[lang][englishText] || currentText;
				var newHtml = currentText.replace(englishText, newText);
				langElem.html(newHtml);
				if (currentText != newHtml) {
					langElem.attr('lang', lang);
				}
			} else {
				//console.log('No language data for element... have you executed .run() first?');
			}
		}
	} else {
		// Restore the deftext data
		langElems.each(function () {
			var langElem = $(this);
			if (langElem.data('deftext')) {
				langElem.html(langElem.data('deftext'));
			}
		});
	}
}

jquery_lang_js.prototype.update = function (lang) {
	this.emit('update', lang);
}