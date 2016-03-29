CKEDITOR.plugins.add("cention_dragimage", {
	init: function(editor) {
		if (editor.addFeature) {
			editor.addFeature({
				allowedContent: 'img[alt,id,!src]{width,height};'
			});
		}
		/*Mujibur I kept it commented to see if any browser have any issues or not!
		if (CKEDITOR.env.gecko || (CKEDITOR.env.ie && CKEDITOR.env.version >= 11)) {
			editor.on('instanceReady', function(event) {
				event.editor.on('paste', this.onPaste);
			});
		} else if (CKEDITOR.env.webkit) {
			editor.on('instanceReady', function(event) {
				event.editor.on('beforePaste', this.onBeforePasteWithClipboard);
			});
			editor.on('contentDom', function () {
				var editableElement = editor.editable();
				editableElement.on('paste', this.onPasteWithClipboard, null, { editor: editor });
			});
		}*/

		editor.on("contentDom", function() {
			var editableElement = editor.editable();
			var parent = editableElement.$.parentNode;
			if (parent.addEventListener) {
				parent.addEventListener('dragenter', function(event) {
					event.stopPropagation();
					event.preventDefault();
				}, false);
				parent.addEventListener('dragover', function(event) {
					event.stopPropagation();
					event.preventDefault();
				}, false);
				parent.addEventListener('drop', function(event) {
					event.stopPropagation();
					event.preventDefault();

					if (event.dataTransfer && event.dataTransfer.files) {
						Array.prototype.forEach.call(event.dataTransfer.files, function(file) {
							editor.fire("drop", file);
						});
					}
				}, false);
			}
		})
	},
	onPaste: function(event) {
		var enabled = _(event.editor.name).getState('enable-file-upload');
		if (!enabled) {
			return;
		}

		if (event.data.dataValue.indexOf('<img') == 0) {
			event.stop();
			handleBase64ImagePaste(event.data.dataValue, event.editor);
		}
	},
	onBeforePasteWithClipboard: function(event) {
		var editor = event.editor;
		var selection = editor.getSelection()
		beforePasteRange = selection.getRanges()[ 0 ];
	},
	onPasteWithClipboard: function(event) {
		var clipboardData = event.data.$.clipboardData;
		var imageType = /^image/;

		var enabled = _(event.listenerData.editor.name).getState('enable-file-upload');
		if (!enabled) {
			return;
		}

		if (!clipboardData) {
			return;
		}

		for (var i = 0; i < clipboardData.types.length; i++) {
			var type = clipboardData.types[i];

			if (type.match(imageType) ||
				(clipboardData.items && typeof jQuery.isArray(clipboardData.items) &&
					clipboardData.items[i].type.match(imageType)))
			{
				handleImagePasteFromClipboard(clipboardData.items[i], event.listenerData.editor);
			}
		}

		beforePasteRange = null;
	}
});
