/**
 * Copyright (c) 2014-2016, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * Basic sample plugin inserting current date and time into the CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/#!/guide/plugin_sdk_intro
 */
CKEDITOR.plugins.add( 'librarybar', {
	icons: 'librarybar',
	init: function( editor ) {
		editor.addCommand( 'insertLibrarybar', {
			exec: function( editor ) {
				var url = urlForApplicationAction( 'errands/popups/library/-/' + ActiveLibraryID );
				mywin = window.open(url, 'preview', 'scrollbars=yes,menubar=no,toolbar=no,width=600,height=600'); 
				mywin.focus();
			}
		});
		editor.ui.addButton( 'Library', {
			label: I('Open Library'),
			command: 'insertLibrarybar',
			toolbar: 'insert',
			icon: this.path + "icons/librarybar.png"
		});
	}
});
