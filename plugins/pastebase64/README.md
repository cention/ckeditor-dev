# ckeditor-pastebase64
This plugin adds the ability to paste images from clipboard as base64 strings using CKEditor.

# What is CKEditor?
CKEditor is a WYSIWYG text editor. See [the official site](http://ckeditor.com) for more details.

# Requirements
The Browser must support the JavaScript File API. Only Chrome and Safari browsers has been tested for the moment.

# Plugin installation and setup
1. Copy the plugin directory into the plugins directory
2. Ensure to reference the plugin.js file from your html file after ckeditor.
3. Enable the plugin by using the extraPlugins configuration setting. Example:  
CKEDITOR.config.extraPlugins = "pastebase64";
