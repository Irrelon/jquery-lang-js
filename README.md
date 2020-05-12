# Instantly switch content languages client-side
### Change language without reloading the page or doing a request to the server. See the example provided in index.html

This jQuery plugin allows you to create multiple language versions of your content by supplying phrase
translations from a default language such as English to other languages.

## Features
* Instant language switching - no page reload required
* Automatic translation of dynamic sections of the page (e.g. loaded via AJAX or added via jQuery)
* Language persistence across pages and reloads via cookie (requires js-cookie.js plugin)
* Supports regular expression search / replace for non-token-based translations
* Supports changing image urls when language changes
* Event hooks for custom processing
* No intervals or timeouts, just high-performance code
* Template strings to inject data into the translated output (new in version 4.0.0)

## Why?
For less modern approaches to sites and apps, some people still utilise jQuery. While the modern approach (and one we advocate) would be to use something like React, React Native or Next.js to create sites and apps, many people still rely on jQuery. When this plugin was created there was nothing like it for jQuery and the plugin has grown steadily in popularity ever since. For that reason we try to maintain this repo and help users who want to use it, but would suggest that anyone who is trying to solve this problem in the year 2020 and beyond, should have adopted a more modern approach by now!

## Who Made This?
This plugin and all related code was created by Irrelon Software Limited, a U.K. registered company with a mission to create awesome web applications and push the boundaries of app development. Check us out at https://www.irrelon.com

#### LinkedIn
http://uk.linkedin.com/pub/rob-evans/25/b94/8a5/

#### GitHub
https://github.com/Irrelon

# How to use
Include the jquery-lang-js library on your page/site/app by putting this in the `<head>` tag:

```html
<script src="js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
```

> If you want language selection to persist across pages automatically, please ensure you include the js-cookie plugin available from: https://github.com/js-cookie/js-cookie on your page as well.

Include the plugin script in your head tag.

```html
<script src="js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
```

Add the following to your HTML page in either the head or body:

```html
<script type="text/javascript">
	// Create language switcher instance
	var lang = new Lang();
	
	lang.init({
		defaultLang: 'en'
	});
</script>
```

The `init()` method takes an options object with the following structure:

```js
lang.init({
	/**
	 * The default language of the page / app.
	 * @type String
	 * @required 
	 */
	defaultLang: 'en',
	
	/**
	 * The current language to set the page to.
	 * @type String
	 * @optional 
	 */
	currentLang: 'en',
	
	/**
	 * This object is only required if you want to override the default
	 * settings for cookies.
	 */
	cookie: {
		/**
		 * Overrides the default cookie name to something else. The default
		 * is "langCookie".
		 * @type String
		 * @optional
		 */
		name: 'langCookie',
		
		expiry: 365,
		path: '/'
	},
	 
	/**
	 * If true, cookies will override the "currentLang" option if the
	 * cookie is set. You usually shouldn't need to specify this option
	 * at all unless your JavaScript lang.init() method is being
	 * dynamically generated by PHP or other server-side processor.
	 * @type Boolean
	 * @optional 
	 */
	allowCookieOverride: true
});
```

# Loading Language Packs Dynamically (Recommended)
> **PLEASE NOTE** You MUST declare your dynamic language packs BEFORE calling
the init() method. Declaring your pack via the dynamic() method does not load
your pack from the server, it just tells the library WHERE the pack is so that
when the language is switched to the one the pack handles, the pack is then
requested from the server.

Instead of loading all the language packs your site provides up front, it can be useful to only load the packs when the
user requests a language be changed. The plugin allows you to simply define the packs and their paths and then it will
handle loading them on demand. To define a language pack to load dynamically call the `lang.dynamic()` method after the
plugin has loaded and been instantiated:

	// Define the thai language pack as a dynamic pack to be loaded on demand
	// if the user asks to change to that language. We pass the two-letter language
	// code and the path to the language pack js file
	lang.dynamic('th', 'js/langpack/th.json');

Example:

	var lang = new Lang();
	
	lang.dynamic('th', 'js/langpack/th.json');
	
	lang.init({
		defaultLang: 'en'
	});

## Including Language Packs Up-Front (Optional)
*The recommended way to use language packs is to define them dynamically (see Loading Language Packs Dynamically above)*

You can include any language pack you have created up-front so they are ready to use straight away on your page. If you
do it this way you must make the language pack a JS file and include a line of code to insert the pack into the Lang 
prototype. See the ./langPack/nonDynamic.js file for an example. Pay attention to the regex section as well as this needs
to define regex patterns directly instead of as strings.

	<script src="js/langpack/nonDynamic.js" charset="utf-8" type="text/javascript"></script>

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

# Placeholder Text

You can also translate placeholder text like this:

    <input type="text" placeholder="my placeholder text" lang="en" />

When you change languages, the plugin will update the placeholder text where a translation exists.

# Translating Text in JavaScript Such as alert() Calls

If you need to know the current translation value of some text in your JavaScript code such as when calling
`alert()` you can use the `translate()` method:

    alert(window.lang.translate('Some text to translate'));
    
# Dynamic Data / Template Strings
> *New in V4.0.0* 

As part of the version 4.0.0 update, you can now use template strings to output dynamic data in your
translations.

For instance, in your translation en.json file if you created a token "myTranslationToken":

    {
        "token": {
            "myTranslationToken":"Hello ${data.firstName} ${data.lastName}"
        }
    }

When you called the `translate()` function with an object that has a firstName and lastName field:

    alert(window.lang.translate("myTranslationToken", "en", {"firstName: "Amelia", "lastName": "Earhart"}));

The resulting translation reads:

    Hello Amelia Earhart

This system uses a custom string template system, not the ES6 one so it has no dependency on ES6
template strings and still works in legacy browsers.

You might have noticed that the translation text used "data.firstName" but when we passed in our
data object it didn't have a "data" field. We wrap your passed data in an object with a data field
like this:

    finalData = {
        data: yourData
    };

This is so that if you only pass a string or a number, you can still access that via ${data} e.g.:

    {
        "token": {
            "myTranslationToken":"Your age is ${data}"
        }
    }
    
And then:

    alert(window.lang.translate("myTranslationToken", "en", 24));

Which results in:

    Your age is 24

You can also pass an array of data and access each element via dot-notation:

    {
        "token": {
            "myTranslationToken":"Your elements are ${data.0}, ${data.1}"
        }
    }

And then:

    alert(window.lang.translate("myTranslationToken", "en", ["Foo", "Bar"]));

Which results in:

    Your elements are Foo, Bar

Using dot-notation you can access any sub-elements of any object or array easily.

Under the hood this is using our dot-notation manipulation library: 
https://www.npmjs.com/package/@irrelon/path

Finally, we've added a new data attribute if you want to place data directly on an
element rather than calling `translate()` via code:

    <div lang="en" data-lang-token="myTranslationToken" data-lang-default-data='{"firstName": "Amelia", "lastName": "Earhart"}'></div>

# Translating Text With a Token

If you do not want to create translation files with long tokens, you can specify custom tokens for elements which contain long text.

To define a custom token, add a data-lang-token attribute to the element.
```html
<div lang="en" data-lang-token="lorem">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in ...</div>
```

To translate the long text
```json
"lorem" : "ตรงกันข้ามกับความเชื่อที่นิยมกัน Lorem Ipsum ไม่ได้เป็นเพียงแค่ชุดตัวอักษรที่สุ่มขึ้นมามั่วๆ แต่หากมีที่มาจากวรรณกรรมละตินคลาสสิกชิ้นหนึ่งในยุค  ..."
```

# Dynamically Loading and Inserting HTML Content

If you load content dynamically and add it to the DOM using jQuery the plugin will AUTOMATICALLY translate
to the current language. Ensure you have added "lang" attributes to any HTML that you want translated BEFORE
you add it to the DOM.

# Switching Languages

To switch languages simply call the `.change()` method, passing the two-letter language code to switch to. For
instance here is a switcher that will change between English and Thai as used in the example page:

    <a href="#lang-en" onclick="window.lang.change('en'); return false;">Switch to English</a> | <a href="#lang-en" onclick="window.lang.change('th'); return false;">Switch to Thai</a>

The onclick event is the only part that matters, you can apply the onclick to any element you prefer.

# Define a Language Pack
Language packs are defined in JSON files and are added to the plugin like so:

    {
    	// Define token (exact phrase) replacements here
    	"token": {
			"propertySearch":"ค้นหา",
			"location":"สถานที่ตั้ง",
			"budget":"งบประมาณ",
			"anotherTokenToUse":"งบประมาณงบประมาณสถานที่ตั้ง",
		},
		// Define regular expression replacements here
		"regex": [
			["My regex", "i", "someReplacement"]
		]
    }

That example just defined a language pack to translate from the default page language English into Thai (th).
Each property inside the token object has a key that is the English phrase, then the value is the Thai equivalent.

The regex section allows you to specify regular expressions to use for matching and replacement. The regular expressions
are only evaluated IF a token-based replacement is not found for a section of text.

It's that simple!

### Using Dynamic Packs
When you call lang.change('th'), the plugin will check if the language pack is already loaded and if not, will load
the pack first before changing languages. Once the pack file has been loaded the plugin will change to that language.

Loading languages dynamically is only done when the the `change()` method is called. This means if you request a
translation of a string via the `translate()` method BEFORE the language pack for that language is loaded the translation
will fail.

If you require a language pack to be loaded and don't want to change the page language you can request loading the pack
manually by calling the `loadPack()` method like so:

	lang.loadPack('th');

If you need to know when the pack has been loaded pass a callback method:

	lang.loadPack('th', function (err) {
		if (err) {
			// There was an error loading the pack
			return;
		}
		
		// The language pack loaded
	});

# Translating Custom Element Attributes
The plugin maintains a list of attributes that will automatically translate and you can specify your own custom attributes too. The attributes that are translated by default are:

* title
* alt
* placeholder
* href

You can specify custom attributes that will be translated by adding them to the attrList property of the lang-js instance. For example to auto-translate an attribute called 'data-name' you would add this after lang-js has been included on your page:

	Lang.prototype.attrList.push('data-name');

# Upgrading from Version 2 to Version 3
Version 3 introduces a new way to instantiate and initialise the library that
provides a better interface to allow further enhancements to the library going
forward without having to introduce breaking changes with each enhancement.

Prior to version 3 you would instantiate the library via:

	var lang = new Lang('en');

Now there is a new `init()` method which should be called AFTER defining your
dynamic loading languages:

	// Instantiate the library
	var lang = new Lang();
	
	// Declare a dynamic language pack
	lang.dynamic('en', 'js/langpack/en.json');
	lang.dynamic('th', 'js/langpack/th.json');
	
	// Initialise the library
	lang.init({
		defaultLang: 'en'
	});

# Bugs, Issues, Questions, Contact and Feature Requests
Please post using the GitHub issues system on this repository.

# Upgrades and Pull Requests

We actively encourage you to upgrade this plugin and provide pull requests to share your awesome work! Please ensure
that any changes you make are:

1. Non-breaking changes
2. Tested thoroughly against the latest version
3. Documented with the JSDoc standard as the other methods are

Thank you to everyone who takes their time to write updates to the plugin!

# Changelog
2020-05-12 - Version 4.0.0
* Added data template support to output translation strings with embedded data.
* Cleaned up and rationalised some of the code with things like early-exits
* More support for data-lang-token because tokens are really the proper way to be doing translations

2017-08-10 - Version 3.0.3 - Fixed bug that stopped library from working,
introduced by merging some code from a pull request.

2015-12-02 - Version 3.0.0 - **BREAKING CHANGES**
* Changed the way the library is instantiated and initialised. Uses
options object now instead of arguments. Allows further extension without
breaking init. If you are using version 2, please note that upgrading to
version 3 will break your code. A minor update is required to get your
existing code working again. See the readme.md section "Upgrading from
Version 2 to Version 3" for details.

2015-11-18 - Version 2.8.1
* Added package.json as per #52

2015-01-09 - Version 2.8
* Added support for changing images when the language changes

2015-01-07 - Version 2.7
* Removed console.log() calls so that old versions of Internet Explorer won't break

2014-06-06 - Version 2.6
* Changed _getTextNodes & _setTextNodes methods to work under IE8. _getTextNodes returns now array of objects where every object have two properties:
	- node - current text node
	- langDefaultText - remember data of current text node 

2014-04-19 - Version 2.5
* Changed dynamically loaded language packs to JSON format. This allows the packs to be loaded by other programming languages such as PHP that can natively interpret JSON but not JavaScript.

2014-02-22 - Version 2.4
* Added dynamic loading of language packs so they don't need to be loaded up front, saving on HTTP requests and memory usage

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

# Roadmap

* **COMPLETED** - Dynamic language pack loading
* **COMPLETED** - Swap image assets based on language
* Swap video assets based on language

# License

This plugin and all code contained is Copyright 2014 Irrelon Software Limited. You are granted a license to use
this code / software as you wish, free of charge and free of restrictions under the MIT license. See the source
code file jquery-lang.js for the full license details.

If you like this project, please consider Flattr-ing it! http://bit.ly/qCEbTC

This project is updated and maintained by:

Irrelon Software Limited
http://www.irrelon.com
