# Instantly switch content languages client-side
### Change language without reloading the page or doing a request to the server. See the example!!

This jQuery plugin allows you to create multiple language versions of your content by supplying phrase translations from a default language such as English to other languages.

# Example

On the example page the language pack used is English to Thai.

http://www.isogenicengine.com/jquery-lang-js/

# How to use

Include the plugin script in your head tag and include any language pack you have created ensuring that you specify the charset attribute as utf-8. All language pack files should be saved as utf-8 encoded:

    <script src="js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
    <script src="js/langpack/en.js" charset="utf-8" type="text/javascript"></script>
    <script src="js/langpack/th.js" charset="utf-8" type="text/javascript"></script>

When your page is loaded simply call the .run() method as so, specifying the default language:

    <script type="text/javascript">
	window.lang = new jquery_lang_js();
	$().ready(function () {
		window.lang.run("th");
	});
    </script>

# Defining which elements to translate

In the HTML content itself you can denote an element as being available for translation by adding a "jql" attribute as such:

    <span jql>translate_me</span>

Or any element with some content such as:

    <select name="testSelect">
        <option jql value="1">an_option_phrase_to_translate</option>
        <option jql" value="2">another_phrase_to_translate</option>
    </select>

# Button elements

The plugin will automatically translate button element text when defined like this:

    <button jql>Some button text</button>

# Placeholder text

You can also translate placeholder text like this:

    <input type="text" placeholder="my_placeholder_text" jql />

When you change languages, the plugin will update the placeholder text where a translation exists.

# Translating other text in JavaScript such as alert() calls

If you need to know the current translation value of some text in your JavaScript code such as when calling alert() you can use the convert() method:

    alert(window.lang.convert('some_text_to_translate'));

# Dynamic content

If you load content dynamically the plugin will need to know when the content has been loaded in order to work correctly. After loading any content always call the plugin's .run() method which will automatically scan the content and translate into the current language.

# Switching languages

To switch languages simply call the .change() method, passing the two-letter language code to switch to. For instance here is a switcher that will change between English and Thai as used in the example page:

    <a href="#lang-en" onclick="window.lang.change('en');">Switch to English</a> | <a href="#lang-en" onclick="window.lang.change('th');">Switch to Thai</a>

The onclick event is the only part that matters, you can apply the onclick to any element you prefer.

# Define a language pack

Language packs are defined in JS files and are added to the plugin like so:

    jquery_lang_js.prototype.lang.th = {
        'property_search':'ค้นหา',
        'location':'สถานที่ตั้ง',
        'budget':'งบประมาณ',
        'an_option_phrase_to_translate':'งบประมาณงบประมาณสถานที่ตั้ง',
    }

That example just defined a language pack to translate into Thai (th). Each property inside the object has a key that is a label, then the value is the Thai message relative to such label.

It's that simple!

# License

This plugin and all code contained is Copyright 2011 Irrelon Software Limited. You are granted a license to use this code / software as you wish, free of charge and free of restrictions.

If you like this project, please consider Flattr-ing it! http://bit.ly/qCEbTC

This project is part of the Isogenic Game Engine, an HTML5 MMO Real-time Multiplayer 2D & Isometric Canvas & DOM Game Engine for the Modern Web. www.isogenicengine.com
