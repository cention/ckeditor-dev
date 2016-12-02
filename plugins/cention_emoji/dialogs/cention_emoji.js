/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */
CKEDITOR.dialog.add('cention_emoji', function(editor) {
	var config = editor.config,
		lang = editor.lang.cention_emoji,
		i;
	var dialog;

	var onClickImg = function(evt) {
		var target = evt.data.getTarget(),
			targetName = target.getName();

		if(targetName == 'a')
			target = target.getChild(0);
		else if(targetName != 'img')
			return;

		var src = target.getAttribute('cke_src'),
			title = target.getAttribute('title');

		var img = editor.document.createElement('img', {
			attributes: {
				src: src,
				'data-cke-saved-src': src,
				title: title,
				alt: title,
				width: target.$.width,
				height: target.$.height
			}
		});

		editor.insertElement(img);
		dialog.hide();
		evt.data.preventDefault();
	};

	var onChoice = function(evt) {
		var target, value;
		if(evt.data)
			target = evt.data.getTarget();
		else
			target = new CKEDITOR.dom.element(evt);

		if(target.getName() == 'a' && (value = target.getChild(0).getHtml())) {
			target.removeClass('cke_light_background');
			dialog.hide();

			// We must use "insertText" here to keep text styled.
			var span = editor.document.createElement('span');
			span.setHtml(value);
			editor.insertText(span.getText());
		}
	};

	var onClick = CKEDITOR.tools.addFunction(onChoice);

	var onKeydown = CKEDITOR.tools.addFunction(function(ev) {
		ev = new CKEDITOR.dom.event(ev);

		// Get an Anchor element.
		var element = ev.getTarget();
		var relative, nodeToMove;
		var keystroke = ev.getKeystroke(),
			rtl = editor.lang.dir == 'rtl';
		switch(keystroke) {
			case 38:
				// UP-ARROW - relative is TR
				if((relative = element.getParent().getParent().getPrevious())) {
					nodeToMove = relative.getChild([element.getParent().getIndex(), 0]);
					nodeToMove.focus();
					onBlur(null, element);
					onFocus(null, nodeToMove);
				}
				ev.preventDefault();
				ev.stopPropagation(); // this can stop tab-keystroke page control UP
				break;
			case 40:
				// DOWN-ARROW - relative is TR
				if((relative = element.getParent().getParent().getNext())) {
					nodeToMove = relative.getChild([element.getParent().getIndex(), 0]);
					if(nodeToMove && nodeToMove.type == 1) {
						nodeToMove.focus();
						onBlur(null, element);
						onFocus(null, nodeToMove);
					}
				}
				ev.preventDefault();
				ev.stopPropagation(); // this can stop tab-keystroke page control DOWN
				break;
			case 32, 13:
				// SPACE ENTER is already handled as onClick
				onChoice({data: ev});
				ev.preventDefault();
				break;
			case rtl ? 37 : 39:
				// RIGHT-ARROW - relative is TD
				if((relative = element.getParent().getNext())) {
					nodeToMove = relative.getChild(0);
					if(nodeToMove.type == 1) {
						nodeToMove.focus();
						onBlur(null, element);
						onFocus(null, nodeToMove);
						ev.preventDefault(true);
					} else {
						onBlur(null, element);
					}
				} else if((relative = element.getParent().getParent().getNext())) {
					// relative is TR
					nodeToMove = relative.getChild([ 0, 0 ]);
					if(nodeToMove && nodeToMove.type == 1) {
						nodeToMove.focus();
						onBlur(null, element);
						onFocus(null, nodeToMove);
						ev.preventDefault(true);
					} else {
						onBlur(null, element);
					}
				}
				break;
			case rtl ? 39 : 37:
				// LEFT-ARROW
				if((relative = element.getParent().getPrevious())) {
					// relative is TD
					nodeToMove = relative.getChild(0);
					nodeToMove.focus();
					onBlur(null, element);
					onFocus(null, nodeToMove);
					ev.preventDefault( true );
				} else if((relative = element.getParent().getParent().getPrevious())) {
					// relative is TR
					nodeToMove = relative.getLast().getChild(0);
					nodeToMove.focus();
					onBlur(null, element);
					onFocus(null, nodeToMove);
					ev.preventDefault(true);
				} else {
					onBlur(null, element);
				}
				break;
			default:
				// Do not stop not handled events.
				return;
		}
	});

	var onAutoClick = CKEDITOR.tools.addFunction(function(ev) {
		editor.plugins.cention_emoji.autoConvert = ev.target.checked;
	});

	var focusedNode;
	var currentTab;

	var onFocus = function(evt, target) {
		var value;
		target = target || evt.data.getTarget();

		if(target.getName() == 'span')
			target = target.getParent();

		if(target.getName() == 'a' && (value = target.getChild(0).getHtml())) {
			// Trigger blur manually if there is focused node.
			if(focusedNode)
				onBlur(null, focusedNode);

			var htmlPreview = dialog.getContentElement(currentTab, 'htmlPreview').getElement();

			dialog.getContentElement(currentTab, 'charPreview').getElement().setHtml(value);
			htmlPreview.setHtml(CKEDITOR.tools.htmlEncode(value));
			target.getParent().addClass('cke_light_background');

			// Memorize focused node.
			focusedNode = target;
		}
	};

	var onBlur = function(evt, target) {
		target = target || evt.data.getTarget();

		if(target.getName() == 'span')
			target = target.getParent();

		if(target.getName() == 'a') {
			dialog.getContentElement(currentTab, 'charPreview').getElement().setHtml('&nbsp;');
			dialog.getContentElement(currentTab, 'htmlPreview').getElement().setHtml('&nbsp;');
			target.getParent().removeClass('cke_light_background');

			focusedNode = undefined;
		}
	};

	var focusFirstEl = function(uiEl) {
		var firstChar = uiEl.getElement().getChild([0, 0, 0, 0, 0]);
		setTimeout(function() {
			firstChar.focus();
			onFocus(null, firstChar);
		}, 0);
	};

	function fillEmoji(tab, emoji, desc, column) {
		var columns = column,
			chars = emoji;

		var charsTableLabel = CKEDITOR.tools.getNextId() +
			'_cention_emoji_table_label';
		var html = ['<table role="listbox" aria-labelledby="' +
			charsTableLabel + '"' + ' style="width: 320px; height: 100%; border-collapse: separate;"' +
			' align="center" cellspacing="2" cellpadding="2" border="0">'];

		var i = 0,
			size = chars.length,
			character, charDesc;

		while(i < size) {
			html.push('<tr role="presentation">');

			for(var j = 0; j < columns; j++, i++) {
				if((character = chars[i])) {
					charDesc = '';

					if(character instanceof Array) {
						charDesc = character[1];
						character = character[0];
					} else {
						//var _tmpName = character.replace('&', '').replace(';', '').replace('#', '');
						// Use character in case description unavailable.
						//charDesc = lang[_tmpName] || character;
						charDesc = desc[i];
					}

					var charLabelId = 'cke_cention_emoji_label_' + i + '_' +
						CKEDITOR.tools.getNextNumber();

					html.push('<td class="cke_dark_background" style="cursor: default;text-align: center" role="presentation">' +
						'<a href="javascript: void(0);" role="option"' +
						' aria-posinset="' + ( i + 1 ) + '"', ' aria-setsize="' +
						size + '"', ' aria-labelledby="' + charLabelId + '"',
						' class="cke_specialchar" title="', CKEDITOR.tools.htmlEncode(charDesc), '"' +
						' onkeydown="CKEDITOR.tools.callFunction(' + onKeydown + ', event, this, \'' + tab + '\')"' +
						' onclick="CKEDITOR.tools.callFunction(' + onClick + ', this, \'' + tab + '\'); return false;"' +
						' tabindex="-1">' +
						'<span style="margin: 0 auto;cursor: inherit">' +
							character +
						// '</span>' +
						// '<span class="cke_voice_label" id="' + charLabelId + '">' +
						// 	charDesc +
						'</span></a>');
				} else {
					// if the character is empty then display space
					html.push('<td class="cke_dark_background">&nbsp;');
				}

				html.push('</td>');
			}
			html.push('</tr>');
		}
		html.push('</table>', '<span id="' + charsTableLabel +
			'" class="cke_voice_label">' + lang.options + '</span>');
		dialog.getContentElement(tab,
			'charContainer').getElement().setHtml(html.join(''));

		var autoOptHTML = '';
		if(tab == 'peopleTab') {
			var checked = '';
			if(editor.plugins.cention_emoji.autoConvert) {
				checked = 'checked ';
			}
			autoOptHTML = '<input type="checkbox" onclick="CKEDITOR.tools.callFunction(' +
				onAutoClick + ', event, this)" ' + checked + '/> Auto convert';
		} else {
			autoOptHTML = '';
		}
		dialog.getContentElement(tab, 'autoConvertOpt').getElement().setHtml(autoOptHTML);
	}

	var emojiSelect = {
		type: 'html',
		id: 'emojiSelector',
		html: '',
		onLoad: function(event) {
			dialog = event.sender;
		},
		focus: function() {
			var self = this;
			// IE need a while to move the focus (#6539).
			setTimeout(function() {
				var firstEmoji = self.getElement().getElementsByTag('a').getItem(0);
				firstEmoji.focus();
			}, 0);
		},
		onClick: onClickImg,
		style: 'width: 100%; border-collapse: separate;'
	};

	var emojiSelector = {
		type: 'hbox',
		align: 'top',
		widths: ['320px', '90px'],
		children: [{
			type: 'html',
			id: 'charContainer',
			html: '',
			onMouseover: onFocus,
			onMouseout: onBlur,
			focus: function() {
				var firstChar = this.getElement().getElementsByTag('a').getItem(0);
				setTimeout(function() {
					firstChar.focus();
					onFocus(null, firstChar);
				}, 0);
			},
			onShow: function() {
				var firstChar = this.getElement().getChild([0, 0, 0, 0, 0]);
				setTimeout(function() {
					firstChar.focus();
					onFocus(null, firstChar);
				}, 0);
			}
		},
		{
			type: 'hbox',
			align: 'top',
			widths: ['100%'],
			children: [{
				type: 'vbox',
				align: 'top',
				children: [{
					type: 'html',
					html: '<div></div>'
				},
				{
					type: 'html',
					id: 'charPreview',
					className: 'cke_dark_background',
					style: 'border:1px solid #eeeeee;font-size:28px;height:40px; \
						width:70px;padding-top:9px;font-family:\'Microsoft Sans Serif\', \
						Arial,Helvetica,Verdana;text-align:center;',
					html: '<div>&nbsp;</div>'
				},
				{
					type: 'html',
					id: 'htmlPreview',
					className: 'cke_dark_background',
					style: 'border:1px solid #eeeeee;font-size:14px;height:20px; \
						width:70px;padding-top:2px;font-family:\'Microsoft Sans Serif\', \
						Arial,Helvetica,Verdana;text-align:center;',
					html: '<div>&nbsp;</div>'
				},
				{
					type: 'html',
					id: 'autoConvertOpt',
					html: '<div></div>'
				}]
			}]
		}]
	};

	return {
		title: editor.lang.cention_emoji.title,
		minWidth: 270,
		minHeight: 120,
		contents: [{
			id: 'peopleTab',
			label: 'PeopleLabel',
			title: 'PeopleTitle',
			expand: true,
			padding: 0,
			elements: [emojiSelector]
		},
		{
			id: 'natureTab',
			label: 'NatureLabel',
			title: 'NatureTitle',
			expand: true,
			padding: 0,
			elements: [emojiSelector]
		},
		{
			id: 'objectTab',
			label: 'ObjectLabel',
			title: 'ObjectTitle',
			expand: true,
			padding: 0,
			elements: [emojiSelector]
		},
		{
			id: 'placeTab',
			label: 'PlaceLabel',
			title: 'PlaceTitle',
			expand: true,
			padding: 0,
			elements: [emojiSelector]
		},
		{
			id: 'symbolTab',
			label: 'SymbolLabel',
			title: 'SymbolTitle',
			expand: true,
			padding: 0,
			elements: [emojiSelector]
		}],
		buttons: [CKEDITOR.dialog.cancelButton],
		charColumns: 17,
		onLoad: function(evt) {
			currentTab = 'peopleTab';
			dialog = evt.sender;
			dialog.on('selectPage', function(e) {
				currentTab = e.data.page;
				setTimeout(function() {
					this.getContentElement(currentTab, 'charContainer').focus();
				}.bind(this), 0);
			});
			fillEmoji('peopleTab', editor.config.people,
				editor.config.people_desc, this.definition.charColumns);
			fillEmoji('natureTab', editor.config.nature,
				editor.config.nature_desc, this.definition.charColumns);
			fillEmoji('objectTab', editor.config.object,
				editor.config.object_desc, this.definition.charColumns);
			fillEmoji('placeTab', editor.config.place,
				editor.config.place_desc, this.definition.charColumns);
			fillEmoji('symbolTab', editor.config.symbol,
				editor.config.symbol_desc, this.definition.charColumns);
		}
	};
});
