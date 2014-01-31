# Instantly switch content languages client-side
### Change language without reloading the page or doing a request to the server. See the example!!

This jQuery plugin allows you to create multiple language versions of your content by supplying phrase translations from a default language such as English to other languages.

# How to use

Include the plugin script in your head tag and include any language pack you have created ensuring that you specify the charset attribute as utf-8. All language pack files should be saved as utf-8 encoded:

    <script src="js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
    <script src="js/langpack/th.js" charset="utf-8" type="text/javascript"></script>

When your page is loaded simply call the .run() method as so:

    <script type="text/javascript">
    // Create language switcher instance and set default language to en and current language to en
	window.lang = new Lang('en', 'en');
    </script>

# Defining which elements to translate

In the HTML content itself you can denote an element as being available for translation by adding a "lang" attribute with the language of the content as such:

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

If you need to know the current translation value of some text in your JavaScript code such as when calling alert() you can use the translate() method:

    alert(window.lang.translate('Some text to translate'));

# Dynamic content

If you load content dynamically the plugin will need to know when the content has been loaded in order to work correctly. After loading any content always call the plugin's .run() method which will automatically scan the content and translate into the current language.

# Switching languages

To switch languages simply call the .change() method, passing the two-letter language code to switch to. For instance here is a switcher that will change between English and Thai as used in the example page:

    <a href="#lang-en" onclick="window.lang.change('en');">Switch to English</a> | <a href="#lang-en" onclick="window.lang.change('th');">Switch to Thai</a>

The onclick event is the only part that matters, you can apply the onclick to any element you prefer.

# Define a language pack

Language packs are defined in JS files and are added to the plugin like so:

    jquery_lang_js.prototype.lang.th = {
        'Property Search':'ค้นหา',
        'Location':'สถานที่ตั้ง',
        'Budget':'งบประมาณ',
        'An option phrase to translate':'งบประมาณงบประมาณสถานที่ตั้ง',
    }

That example just defined a language pack to translate from the default page language English into Thai (th). Each property inside the object has a key that is the English phrase, then the value is the Thai equivalent.

It's that simple!

# License

This plugin and all code contained is Copyright 2011 Irrelon Software Limited. You are granted a license to use this code / software as you wish, free of charge and free of restrictions.

If you like this project, please consider Flattr-ing it! http://bit.ly/qCEbTC

This project is part of the Isogenic Game Engine, an HTML5 MMO Real-time Multiplayer 2D & Isometric Canvas & DOM Game Engine for the Modern Web. www.isogenicengine.com