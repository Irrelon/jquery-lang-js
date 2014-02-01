/*
 The MIT License (MIT)

 Copyright (c) 2014 Irrelon Software Limited
 http://www.irrelon.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice, url and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

 Source: https://github.com/coolbloke1324/jquery-lang-js

 Changelog:
 Version 2.0.0 - Complete re-write.
 */
var Lang = (function () {
	var Lang = function (defaultLang, currentLang, allowCookieOverride) {
		var self = this,
			cookieLang;
		
		// Store existing mutation methods so we can auto-run
		// translations when new data is added to the page
		this._mutationCopies = {
			append: $.fn.append,
			appendTo: $.fn.appendTo,
			prepend: $.fn.prepend,
			before: $.fn.before,
			after: $.fn.after
		};
		
		// Now override the existing mutation methods with our own
		$.fn.append = function () { return self._mutation(this, 'append', arguments) };
		$.fn.appendTo = function () { return self._mutation(this, 'appendTo', arguments) };
		$.fn.prepend = function () { return self._mutation(this, 'prepend', arguments) };
		$.fn.before = function () { return self._mutation(this, 'before', arguments) };
		$.fn.after = function () { return self._mutation(this, 'after', arguments) };
		
		// Set default and current language to the default one
		// to start with
		this.defaultLang = defaultLang || 'en';
		this.currentLang = defaultLang || 'en';
		
		// Check for cookie support when no current language is specified
		if ((allowCookieOverride || !currentLang) && $.cookie) {
			// Check for an existing language cookie
			cookieLang = $.cookie('langCookie');
			
			if (cookieLang) {
				// We have a cookie language, set the current language
				currentLang = cookieLang;
			}
		}

		$(function () {
			// Setup data on the language items
			self._start();
	
			// Check if the current language is not the same as our default
			if (currentLang && currentLang !== self.defaultLang) {
				// Switch to the current language
				self.change(currentLang);
			}
		})
	};

	/**
	 * Object that holds the language packs.
	 * @type {{}}
	 */
	Lang.prototype.pack = {};

	/**
	 * Array of translatable attributes to check for on elements.
	 * @type {string[]}
	 */
	Lang.prototype.attrList = [
		'title',
		'alt',
		'placeholder'
	];

	/**
	 * Loads a new language pack from the given url.
	 * @param {string} packPath The url to load the pack from.
	 */
	Lang.prototype.loadPack = function (packPath) {
		if (packPath) {
			$('<script type="text/javascript" charset="utf-8" src="' + packPath + '" />').appendTo("head");
		} else {
			throw('Cannot load language pack, no file path specified!');
		}
	};

	/**
	 * Scans the DOM for elements with [lang] selector and saves translate data
	 * for them for later use.
	 * @private
	 */
	Lang.prototype._start = function (selector) {
		// Get the page HTML
		var arr = selector !== undefined ? $(selector).find('[lang]') : $(':not(html)[lang]'),
			arrCount = arr.length,
			elem;

		while (arrCount--) {
			elem = $(arr[arrCount]);

			if (elem.attr('lang') === this.defaultLang) {
				this._processElement(elem);
			}
		}
	};
	
	Lang.prototype._processElement = function (elem) {
		if (!elem.data('lang-done')) {
			// Store translatable attributes
			this._storeAttribs(elem);
	
			// Store translatable content
			this._storeContent(elem);
			
			// Store marker to show we've processed this element
			elem.data('lang-done', true);
		}
	};

	/**
	 * Stores the translatable attribute values in their default language.
	 * @param {object} elem The jQuery selected element.
	 * @private
	 */
	Lang.prototype._storeAttribs = function (elem) {
		var attrIndex,
			attr,
			attrObj;

		for (attrIndex = 0; attrIndex < this.attrList.length; attrIndex++) {
			attr = this.attrList[attrIndex];
			if (elem.attr(attr)) {
				// Grab the existing attribute store or create a new object
				attrObj = elem.data('lang-attr') || {};

				// Add the attribute and value to the store
				attrObj[attr] = elem.attr(attr);

				// Save the attribute data to the store
				elem.data('lang-attr', attrObj);
			}
		}
	};

	/**
	 * Reads the existing content from the element and stores it for
	 * later use in translation.
	 * @param elem
	 * @private
	 */
	Lang.prototype._storeContent = function (elem) {
		// Check if the element is an input element
		if (elem.is('input')) {
			switch (elem.attr('type')) {
				case 'button':
				case 'submit':
				case 'reset':
					elem.data('lang-val', elem.val());
					break;
			}
		} else {
			// Get the text nodes immediately inside this element
			var nodes = this._getTextNodes(elem);
			if (nodes) {
				elem.data('lang-text', nodes);
			}
		}
	};

	/**
	 * Retrieves the text nodes from an element and returns them.
	 * @param elem
	 * @returns {Array|*}
	 * @private
	 */
	Lang.prototype._getTextNodes = function (elem) {
		var nodes = elem.contents(),
			nodeArr;
		
		nodeArr = nodes.filter(function () {
			this.langDefaultText = this.data;
			return this.nodeType === 3;
		});
		
		return nodeArr;
	};

	/**
	 * Sets text nodes of an element translated based on the passed language.
	 * @param elem
	 * @param nodes
	 * @param lang
	 * @private
	 */
	Lang.prototype._setTextNodes = function (elem, nodes, lang) {
		var index,
			textNode,
			defaultText,
			translation,
			langNotDefault = lang !== this.defaultLang;
		
		for (index = 0; index < nodes.length; index++) {
			textNode = nodes[index];
			
			if (langNotDefault) {
				defaultText = $.trim(textNode.langDefaultText);
				
				if (defaultText) {
					// Translate the langDefaultText
					translation = this.translate(defaultText, lang);
					
					if (translation) {
						// Replace the text with the translated version
						textNode.data = textNode.data.split(defaultText).join(translation);
					}
				}
			} else {
				// Replace with original text
				textNode.data = textNode.langDefaultText;
			}
		}
	};

	/**
	 * Translates and sets the attributes of an element to the passed language.
	 * @param elem
	 * @param lang
	 * @private
	 */
	Lang.prototype._translateAttribs = function (elem, lang) {
		var attr,
			attrObj = elem.data('lang-attr') || {},
			translation;

		for (attr in attrObj) {
			if (attrObj.hasOwnProperty(attr)) {
				// Check the element still has the attribute
				if (elem.attr(attr)) {
					if (lang !== this.defaultLang) {
						// Get the translated value
						translation = this.translate(attrObj[attr], lang);

						// Check we actually HAVE a translation
						if (translation) {
							// Change the attribute to the translated value
							elem.attr(attr, translation);
						}
					} else {
						// Set default language value
						elem.attr(attr, attrObj[attr]);
					}
				}
			}
		}
	};

	/**
	 * Translates and sets the contents of an element to the passed language.
	 * @param elem
	 * @param lang
	 * @private
	 */
	Lang.prototype._translateContent = function (elem, lang) {
		var langNotDefault = lang !== this.defaultLang,
			translation,
			nodes;

		// Check if the element is an input element
		if (elem.is('input')) {
			switch (elem.attr('type')) {
				case 'button':
				case 'submit':
				case 'reset':
					if (langNotDefault) {
						// Get the translated value
						translation = this.translate(elem.data('lang-val'), lang);

						// Check we actually HAVE a translation
						if (translation) {
							// Set translated value
							elem.val(translation);
						}
					} else {
						// Set default language value
						elem.val(elem.data('lang-val'));
					}
					break;
			}
		} else {
			// Set text node translated text
			nodes = elem.data('lang-text');
			if (nodes) {
				this._setTextNodes(elem, nodes, lang);
			}
		}
	};

	/**
	 * Call this to change the current language on the page.
	 * @param {String} lang The new two-letter language code to change to.
	 */
	Lang.prototype.change = function (lang, selector) {
		var fireAfterUpdate = false,
			currLang = this.currentLang;
		
		if (this.currentLang != lang) {
			this.beforeUpdate(currLang, lang);
			fireAfterUpdate = true;
		}
		
		this.currentLang = lang;
		
		// Get the page HTML
		var arr = selector !== undefined ? $(selector).find('[lang]') : $(':not(html)[lang]'),
			arrCount = arr.length,
			elem;

		while (arrCount--) {
			elem = $(arr[arrCount]);

			if (elem.attr('lang') !== lang) {
				this._translateElement(elem, lang);
			}
		}
		
		if (fireAfterUpdate) {
			this.afterUpdate(currLang, lang);
		}
		
		// Check for cookie support
		if ($.cookie) {
			// Set a cookie to remember this language setting with 1 year expiry
			$.cookie('langCookie', lang, {
				expires: 365,
				path: '/'
			});
		}
	};
	
	Lang.prototype._translateElement = function (elem, lang) {
		// Translate attributes
		this._translateAttribs(elem, lang);

		// Translate content
		this._translateContent(elem, lang);

		// Update the element's current language
		elem.attr('lang', lang);
	};

	/**
	 * Translates text from the default language into the passed language.
	 * @param {String} text The text to translate.
	 * @param {String} lang The two-letter language code to translate to.
	 * @returns {*}
	 */
	Lang.prototype.translate = function (text, lang) {
		lang = lang || this.currentLang;

		var translation = '';

		if (lang != this.defaultLang) {
			// Check for a direct token translation
			translation = this.pack[lang].token[text];

			if (!translation) {
				// No token translation was found, test for regex match
				translation = this._regexMatch(text, lang);
			}

			return translation || text;
		} else {
			return text;
		}
	};

	/**
	 * Checks the regex items for a match against the passed text and
	 * if a match is made, translates to the given replacement.
	 * @param {String} text The text to test regex matches against.
	 * @param {String} lang The two-letter language code to translate to.
	 * @returns {string}
	 * @private
	 */
	Lang.prototype._regexMatch = function (text, lang) {
		// Loop the regex array and test them against the text
		var arr,
			arrCount,
			arrIndex,
			item,
			regex,
			expressionResult;
		
		arr = this.pack[lang].regex;
		
		if (arr) {
			arrCount = arr.length;
			
			for (arrIndex = 0; arrIndex < arrCount; arrIndex++) {
				item = arr[arrIndex];
				regex = item[0];
	
				// Test regex
				expressionResult = regex.exec(text);
	
				if (expressionResult && expressionResult[0]) {
					return text.split(expressionResult[0]).join(item[1]);
				}
			}
		}

		return '';
	};

	Lang.prototype.beforeUpdate = function (currentLang, newLang) {
		$(this).triggerHandler('beforeUpdate', [currentLang, newLang, this.pack[currentLang], this.pack[newLang]]);
	};
	
	Lang.prototype.afterUpdate = function (currentLang, newLang) {
		$(this).triggerHandler('afterUpdate', [currentLang, newLang, this.pack[currentLang], this.pack[newLang]]);
	};
	
	Lang.prototype.refresh = function () {
		// Process refresh on the page
		this.change(this.currentLang);
	};
	
	////////////////////////////////////////////////////
	// Mutation overrides
	////////////////////////////////////////////////////
	Lang.prototype._mutation = function (context, method, args) {
		var result = this._mutationCopies[method].apply(context, args);
		
		var rootElem = $(context);
		
		// Record data on the default language from the root element
		this._processElement(rootElem);
		
		// Record data on the default language from the root's children
		this._start(rootElem);
		
		// Translate the root element
		this._translateElement(rootElem, this.currentLang);
		
		// Process translation on any child elements of this element
		this.change(this.currentLang, rootElem);
		
		return result;
	};

	return Lang;
})();
