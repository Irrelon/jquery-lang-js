# Client-Side Instant Content Language Update Plugin

This jQuery plugin allows you to create multiple language versions of your content by supplying phrase translations from a default language such as English to other languages.

# Example

On the example page the language pack used is English to Thai.

http://www.isogenicengine.com/jquery-lang-js/

# How To Use

Include the plugin script in your head tag and include any language pack you have created ensuring that you specify the charset attribute as utf-8. All language pack files should be saved as utf-8 encoded:

    <script src="js/jquery-lang.js" charset="utf-8" type="text/javascript"></script>
    <script src="js/langpack/th.js" charset="utf-8" type="text/javascript"></script>

# Defining Which Elements To Translate

In the HTML content itself you can denote an element as being available for translation by adding a "lang" attribute with the language of the content as such:

    <span lang="en">Translate me</span>

# Dynamic Content

If you load content dynamically the plugin will need to know when the content has been loaded in order to work correctly. After loading any content always call the plugin's .run() method which will automatically scan the content and translate into the current language.

# Switching Languages

To switch languages simply call the .change() method, passing the two-letter language code to switch to. For instance here is a switcher that will change between English and Thai as used in the example page:

    <a href="#lang-en" onclick="window.lang.change('en');">Switch to English</a> | <a href="#lang-en" onclick="window.lang.change('th');">Switch to Thai</a>

The onclick event is the only part that matters, you can apply the onclick to any element you prefer.