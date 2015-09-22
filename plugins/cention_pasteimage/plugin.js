(function () {
	'use strict';

	CKEDITOR.plugins.add('cention_pasteimage', {
		init: init
	});

	function init(editor) {
		if (editor.addFeature) {
			editor.addFeature({
				allowedContent: 'img[alt,id,!src]{width,height};'
			});
		}

		if (CKEDITOR.env.gecko || (CKEDITOR.env.ie && CKEDITOR.env.version >= 11)) {
			editor.on('instanceReady', function(event) {
				event.editor.on('paste', onPaste);
			});
		} else if (CKEDITOR.env.webkit) {
			editor.on('contentDom', function () {
				var editableElement = editor.editable();
				editableElement.on('paste', onPasteWithClipboard, null, { editor: editor });
			});
		}

		editor.on('contentDom', function () {
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
							handleFile(file, editor);
						});
					}
				}, false);
			}
		});
	}

	function randomId() {
		return Math.floor(Math.random() * 6) + '' + i + '' + Math.floor('' + new Date() / 1000);
	}

	function onPaste(event) {
		if (event.data.dataValue.indexOf('<img') == 0) {
			event.stop();
			handleBase64ImagePaste(event.data.dataValue, event.editor);
		}
	}

	function handleBase64ImagePaste(value, editor) {
		var fid = randomId();
		var pos = value.indexOf(',') + 1;
		var pre = value.slice(0, pos);
		var type = pre.slice(pre.indexOf(':') + 1, pre.indexOf(';'));
		var data = value.slice(pos, value.length);
		var file = dataToFile(data.slice(0, data.indexOf('"')), type);

		handleFile(file, editor)
	}

	function dataToFile(data, type) {
		var byteCharacters = atob(data);
		var byteArrays = [];
		var sliceSize = 512;

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array( slice.length );
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		return new Blob(byteArrays, { type: type });
	}

	function onPasteWithClipboard(event) {
		var clipboardData = event.data.$.clipboardData;
		var found = false;
		var imageType = /^image/;

		if (!clipboardData) {
			return;
		}

		return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
			if (found) {
				return;
			}

			if (type.match(imageType) ||
				(clipboardData.items && typeof jQuery.isArray(clipboardData.items) &&
					clipboardData.items[i].type.match(imageType)))
			{
				handleImagePasteFromClipboard(clipboardData.items[i], event.listenerData.editor);
				return found = true;
			}
		});
	}

	function handleImagePasteFromClipboard(item, editor) {
		if (!item || typeof item.getAsFile !== 'function') {
			return;
		}

		var file = item.getAsFile();
		handleFile(file, editor);
	}

	function handleFile(file, editor) {
		var fid = randomId();
		var name = file.type.replace('/', '.');
		var url = urlForApplicationCommand(
			wfStringExpand('answer/upload/attachment/{0}/{1}', fid, encodeURIComponent(name))
		);

		var img = editor.document.createElement('img', {
			attributes: {
				src: WFApplicationURI + 'Resources/Templates/Master.template/Images/ajax-loader-kit-blue.gif'
			}
		});
		editor.insertElement(img);

		var reader = new FileReader();
		reader.onload = function(e) {
			img.setStyle('opacity', '0.3');
			img.setAttribute('src', e.target.result);
		};
		reader.readAsDataURL(file);

		_('AnswerAttachmentList').addUploadItemById(fid, name, true);
		sendFile(fid, name, file, function() {
			img.setAttribute('src', url);
			img.removeStyle('opacity');

			_('AnswerAttachmentList').updateToSuccess(fid, url, file.size, function() {
				img.remove();
			});
		});
	}

	function sendFile(fid, name, file, callback) {
		var uri = urlForApplicationAction('uploadMultipleFiles');
		var xhr = new XMLHttpRequest();
		var fd = new FormData();

		xhr.open('POST', uri, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				callback();
			}
		};

	    fd.append('uploadedFile', file);
	    fd.append('random', fid);
	    fd.append('name', name);
		xhr.send(fd);
	}

})();
