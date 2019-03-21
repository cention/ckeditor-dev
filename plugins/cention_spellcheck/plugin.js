CKEDITOR.plugins.add("cention_spellcheck", {
	config: {
		lang: "en_US",
		parser: "html",
		webservice: {
			path: "",
			driver: "aspell"
		},
		suggestBoxScrollBar: {},
		suggestBox: {
			position: "below",
			appendTo: "body"
		}
	},

	icons: "spellchecker",

	init: function( editor ) {
		var plugin = this;

		this.config.suggestBox.position = this.positionSuggestBox();

		editor.addCommand("spellchecker", {
			canUndo: false,
			readOnly: 1,
			exec: function(editor, data) {
				if(data && data.lang){
					plugin.config.lang = data.lang;
				}
				plugin.toggle(editor);
			}
		});
		this.config.suggestBoxScrollBar = editor.config.suggestBoxScrollBar;

		editor.ui.addRichCombo("SpellCheckerLanguage", {
			label: I("Language"),
			title: I("Language"),
			toolbar: "spellchecker,5",
			panel: {
				css: [ CKEDITOR.skin.getPath("editor") ].concat(editor.config.contentsCss),
				multiSelect: false,
				attributes: {
					"aria-label": I("Language")
				}
			},
			init: function() {
				var languages = editor.config.spellCheckLanguages;
				this.startGroup(I("Language"));
				if( languages ) {
					for( var i = 0; i < languages.length; i++ ) {
						var language = languages[i];
						this.add(language.value, language.value, language.value);
					}
				}
			},
			onRender: function() {
				//console.log('onRender');
				var languages = editor.config.spellCheckLanguages;
				//console.log('languages: ' + languages);
				for( var i = 0; i < languages.length; i++ ) {
					var language = languages[i];
					//console.log('language: ' + language);
					if( language.selected ) {
						//console.log('yes');
						this.setValue(language.value);
						plugin.config.lang = language.id;
					}
				}
			},
			onClick: function( selected ) {
				var languages = editor.config.spellCheckLanguages;
				this.setValue(selected);
				for( var i = 0; i < languages.length; i++ ) {
					var language = languages[i];
					if( selected == language.value ) {
						plugin.config.lang = language.id;
						break;
					}
				}
			},
			onSetValue: function( value ) {
				if( !value ) {
					var languages = editor.config.spellCheckLanguages;
					for( i = 0; i < languages.length; i++ ) {
						var language = languages[i];
						if( plugin.config.lang == language.id ) {
							this._.value = language.value;
							value = language.value;
							break;
						}
					}
				}
				if( value ) {
					var label = this.document.getById("cke_" + this.id + "_text");
					if( label ) {
						if( editor.readOnly ) {
							label.addClass("cke_combo_inlinelabel");
						} else {
							label.removeClass("cke_combo_inlinelabel");
						}
						label.setText(value);
					}
				}
			}
		});

		editor.ui.addButton("SpellChecker", {
			label: I("Perform Spell Check"),
			command: "spellchecker",
			toolbar: "spellchecker,10"
		});

		editor.on("saveSnapshot", function() {
			plugin.destroy();
		});
	},
	create: function() {
		this.editor.setReadOnly(true);
		this.editor.commands.spellchecker.toggleState();
		jQuery('.cke_button__spellchecker_label').text(I('Finish spell check'));
		jQuery('.cke_button__spellchecker_icon').removeClass('cke_button__spellchecker_icon');
		jQuery('.cke_button__spellchecker_icon').addClass('cke_button__spellchecker_icon_select');
		this.editorWindow = this.editor.document.getWindow().$;
		this.createSpellchecker();
		this.spellchecker.check();
		jQuery(this.editorWindow).on("scroll.spellchecker", jQuery.proxy(function() {
			if( this.spellchecker.suggestBox )
				this.spellchecker.suggestBox.close();
		}, this));
	},
	destroy: function() {
		if( this.spellchecker ) {
			this.spellchecker.destroy();
			this.spellchecker = null;
			this.editor.setReadOnly(false);
			this.editor.commands.spellchecker.toggleState();
			jQuery('.cke_button__spellchecker_label').text(I('Perform spell check'));
			jQuery('.cke_button__spellchecker_icon_select').removeClass('cke_button__spellchecker_icon_select');
			jQuery('.cke_button__spellchecker_icon_select').addClass('cke_button__spellchecker_icon');
			jQuery(this.editorWindow).off(".spellchecker");
			this.editor.fire("change");
		}
	},
	toggle: function( editor ) {
		this.editor = editor;
		if( this.spellchecker ) {
			this.destroy();
		} else {
			this.create();
		}
	},
	createSpellchecker: function() {
		var plugin = this;
		plugin.config.getText = function() {
			return jQuery("<div />").append(plugin.editor.getData()).text()
		};
		plugin.config.webservice.path = "/Cention/web/spell/check";
		plugin.spellchecker = new jQuery.SpellChecker(plugin.editor.document.$.body, this.config);
		plugin.spellchecker.on("check.success", function() {
			alert(I("There are no misspelled words"));
			plugin.destroy();
		});
		plugin.spellchecker.on("replace.word", function() {
			plugin.editor.fire("change");
			if( plugin.spellchecker.parser.incorrectWords.length === 0 ) 
				plugin.destroy();
		});
	},
	positionSuggestBox: function() {
		var plugin = this;
		return function() {
			var d = plugin.editor,
				a = (this.wordElement.data("firstElement") || this.wordElement)[0],
				c = jQuery(d.container.$).find("iframe").offset(),
				g = jQuery(d.container.$).offset(),
				h = jQuery(a).offset(),
				d = h.left + g.left,
				a = h.top + g.top + (c.top - g.top) + a.offsetHeight,
				a = a - jQuery(plugin.editorWindow).scrollTop();
			if((typeof this.config.suggestBoxScrollBar !== "undefined") &&
				(typeof this.config.suggestBoxScrollBar.overflowY !== 
					"undefined") &&
				(typeof this.config.suggestBoxScrollBar.maxHeight !==
					"undefined") &&
				(this.config.suggestBoxScrollBar.overflowY == true)){
				this.container.css({
					'overflow-y': "scroll",
					'overflow-x': "auto",
					'max-height': this.config.suggestBoxScrollBar.maxHeight,
					top: a,
					left: d
				})
			} else{
				this.container.css({
					top: a,
					left: d
				})
			}
		}
	}
});
