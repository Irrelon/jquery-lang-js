# Instantly switch content languages client-side
### Change language without reloading the page or doing a request to the server. See the example provided in index.html

This jQuery plugin allows you to create multiple language versions of your content by supplying phrase
translations from a default language such as English to other languages.

# Changelog
2014-02-02 - Version 2.3
* Fixed bug when switching from non-default language to other non-default language

2014-02-01 - Version 2.2
* Check that a language pack actually exists before trying to switch to it
* Allow disabling event firing so dynamic elements wont fire update events
* Allow cookies to override passed current language on constructor if passing true as third arg to new Lang()
* Fix to allow auto-translate when using jQuery appendTo() method
* Fix for dynamic translation of root-element text nodes

2014-02-01 - Version 2.1
* Fixed break in jQuery chaining
* Added cookies for persistence when $.cookie exists
* Supports automatic translation for dynamically added content (when added via jQuery)
* Added support for regular expression matches
* Added support for translating text nodes mixed with html nodes

2014-01-31 - Version 2.0
* Complete plugin re-write

# How to use

*If you want language selection to persist across pages automatically, please ensure you include the
jquery-cookie plugin available from: https://github.com/carhartl/jquery-cookie on your page as well.*

Include the plugin script in your head tag and include any language pack you have created ensuring that
you specify the charset attribute as utf-8. All language pack files should be saved as utf-8 encoded:

    <script src="js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
    <script src="js/langpack/th.js" charset="utf-8" type="text/javascript"></script>

Add the following to your HTML page in either the head or body:

    <script type="text/javascript">
    // Create language switcher instance and set default language to en
	window.lang = new Lang('en');
    </script>

# Defining which elements to translate

In the HTML content itself you can denote an element as being available for translation by adding a "lang"
attribute with the language of the content as such:

    <span lang="en">Translate me</span>

Or any element with some content such as:

    <select name="testSelect">
        <option lang="en" value="1">An option phrase to translate</option>
        <option lang="en" value="2">Another phrase to translate</option>
    </select>

# Button elements

The plugin will automatically translate button element text when defined like this:

    <button lang="en">Some button text</button>

# Placeholder text

You can also translate placeholder text like this:

    <input type="text" placeholder="my placeholder text" lang="en" />

When you change languages, the plugin will update the placeholder text where a translation exists.

# Translating other text in JavaScript such as alert() calls

If you need to know the current translation value of some text in your JavaScript code such as when calling
alert() you can use the translate() method:

    alert(window.lang.translate('Some text to translate'));

# Dynamic content

If you load content dynamically and add it to the DOM using jQuery the plugin will AUTOMATICALLY translate
to the current language. Ensure you have added "lang" attributes to any HTML that you want translated BEFORE
you add it to the DOM.

# Switching languages

To switch languages simply call the .change() method, passing the two-letter language code to switch to. For
instance here is a switcher that will change between English and Thai as used in the example page:

    <a href="#lang-en" onclick="window.lang.change('en');">Switch to English</a> | <a href="#lang-en" onclick="window.lang.change('th');">Switch to Thai</a>

The onclick event is the only part that matters, you can apply the onclick to any element you prefer.

# Define a language pack

Language packs are defined in JS files and are added to the plugin like so:

    Lang.prototype.pack.th = {
    	// Define token (exact phrase) replacements here
    	token: {
			'Property Search':'ค้นหา',
			'Location':'สถานที่ตั้ง',
			'Budget':'งบประมาณ',
			'An option phrase to translate':'งบประมาณงบประมาณสถานที่ตั้ง',
		},
		// Define regular expression replacements here
		regex: [
			[/My regex/i, 'someReplacement']
		]
    }

That example just defined a language pack to translate from the default page language English into Thai (th).
Each property inside the token object has a key that is the English phrase, then the value is the Thai equivalent.

The regex section allows you to specify regular expressions to use for matching and replacement. The regular expressions
are only evaluated IF a token-based replacement is not found for a section of text.

It's that simple!

# Upgrades and Pull Requests

We actively encourage you to upgrade this plugin and provide pull requests to share your awesome work! Please ensure
that any changes you make are:

1. Non-breaking changes
2. Tested thoroughly against the latest version
3. Documented with the JSDoc standard as the other methods are
4. Update the changelog at the top of this file with your updates

Thank you to everyone who takes their time to write updates to the plugin!

# License

This plugin and all code contained is Copyright 2014 Irrelon Software Limited. You are granted a license to use
this code / software as you wish, free of charge and free of restrictions under the MIT license. See the source
code file jquery-lang.js for the full license details.

If you like this project, please consider Flattr-ing it! http://bit.ly/qCEbTC

This project is part of the Isogenic Game Engine, an HTML5 MMO Real-time Multiplayer 2D & Isometric Canvas Game
Engine for the Modern Web and was made available by:

Irrelon Software Limited

http://www.orbzu.com
http://www.irrelon.com
http://www.isogenicengine.com