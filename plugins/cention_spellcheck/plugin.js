CKEDITOR.plugins.add("cention_spellcheck", {
	config: {
		lang: "en_US",
		parser: "html",
		webservice: {
			path: "",
			driver: "aspell"
		},
		suggestBox: {
			position: "below",
			appendTo: "body"
		}
	},

	init: function( editor ) {
		var plugin = this;

		this.config.suggestBox.position = this.positionSuggestBox();

		editor.addCommand("cention_spellcheck", {
			canUndo: false,
			readOnly: 1,
			exec: function() {
				plugin.toggle(editor);
			}
		});

		editor.ui.addRichCombo("Cention_SpellCheckLanguageSelector", {
			label: I("Language"),
			title: I("Language"),
			toolbar: "spellchecker,5",
			panel: {
				css: [CKEDITOR.skin.getPath("editor")].concat(editor.config.contentsCss),
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
				var languages = editor.config.spellCheckLanguages;
				for( var i = 0; i < languages.length; i++ ) {
					var language = languages[i];
					if( language.selected ) {
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
					if( selected == langauge.value ) {
						plugin.config.lang = language.id;
						break;
					}
				}
			},
			onSetValue: function( language ) {
				if( !language ) {
					var languages = editor.config.spellCheckLanguages;
					for( i = 0; i < languages.length; i++ ) {
						language = languages[i];
						if( plugin.config.lang == language.id ) {
							this._.value = language.value;
							var label = this.document.getById("cke_" + this.id + "_text");
							if( label ) {
								if( editor.readOnly ) {
									label.addClass("cke_combo_inlinelabel");
								} else {
									label.removeClass("cke_combo_inlinelabel");
								}
								label.setText(language.value);
							}
							break;
						}
					}
				}
			}
		});

		editor.ui.addButton("Cention_SpellCheck", {
			label: I("Perform Spell Check"),
			command: "cention_spellcheck",
			toolbar: "spellchecker,10"
		});

		editor.on("saveSnapshot", function() {
			plugin.destroy();
		})
	},
	create: function() {
		this.editor.setReadOnly(true);
		this.editor.commands.cention_spellcheck.toggleState();
		jQuery('.cke_button__cention_spellcheck_label').text(I('Finish spell check'));
		jQuery('.cke_button__cention_spellcheck_icon').removeClass('cke_button__cention_spellcheck_icon').addClass('cke_button__cention_spellcheck_icon_select');
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
			this.editor.commands.cention_spellcheck.toggleState();
			jQuery('.cke_button__cention_spellcheck_label').text(I('Perform spell check'));
			jQuery('.cke_button__cention_spellcheck_icon_select').removeClass('cke_button__cention_spellcheck_icon_select').addClass('cke_button__cention_spellcheck_icon');
			jQuery(this.editorWindow).off(".spellchecker")
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
		plugin.config.webservice.path = urlForApplicationAction("spellcheck");
		plugin.spellchecker = new jQuery.SpellChecker(plugin.editor.document.$.body, this.config);
		plugin.spellchecker.on("check.success", function() {
			alert(I("There are no misspelled words"));
			plugin.destroy();
		});
		plugin.spellchecker.on("replace.word", function() {
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
			this.container.css({
				top: a,
				left: d
			})
		}
	}
});