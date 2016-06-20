CKEDITOR.plugins.add("cention_image", {
	requires: "panelbutton,floatpanel",

	icons: "image",

	init: function( editor ) {
		editor.ui.add("Image", CKEDITOR.UI_PANELBUTTON, {
			label: I("Image"),
			title: I("Image"),
			modes: {
				wysiwyg: 1
			},
			editorFocus: 1,
			toolbar: "insert,10",
			panel: {
				css: CKEDITOR.skin.getPath("editor"),
				attributes: {
					role: "listbox",
					"aria-label": I("Image")
				}
			},
			onBlock: function( panel, block ) {
				block.autoSize = true;
				block.element.getDocument().getBody().setStyle("overflow", "hidden");

				block.element.setHtml(function() {
					var output = [];
					var selectedTd = null;
					var	selectFunction = CKEDITOR.tools.addFunction(function( td ) {
							if( !selectedTd ) {
								selectedTd = panel._.iframe.getFrameDocument().getById("cention_image_first_item");
							}
							selectedTd.removeStyle("background-color");
							var selected = new CKEDITOR.dom.element(td);
							selected.setStyle("background-color", "rgb(163, 215, 255)");
							selectedTd = selected;
						});
					var cancelFunction = CKEDITOR.tools.addFunction(function() {
							editor.focus();
							panel.hide();
						});
					var insertFunction = CKEDITOR.tools.addFunction(function() {
							if( !selectedTd ) {
								selectedTd = panel._.iframe.getFrameDocument().getById("cention_image_first_item");
							}
							editor.focus();
							panel.hide();
							editor.fire("saveSnapshot");
							var selectedImg = null;
							var children = selectedTd.getChildren();
							for( var i = 0; i < children.count(); i++ ) {
								var child = new CKEDITOR.dom.element(children.getItem(i).$);
								if( child.getName() == "img" ) {
									selectedImg = child;
									break;
								}
							}
							if( selectedImg ) {
								editor.fire("saveSnapshot");
								var img = editor.document.createElement("img");
								img.setAttribute("src", selectedImg.getAttribute("src"));
								editor.insertElement(img);
								editor.fire("saveSnapshot");
							}
						});
					output.push('<div style="width: 450px; overflow-x: auto;">');
					output.push('\t<table border="0" cellspacing="0" cellpadding="0">');
					output.push("\t\t<tr>");

					if( editor.___fileArchiveImages.length == 0 ) {
						output.push('\t\t\t<td style="padding-left: 5px; padding-top: 5px; padding-bottom: 5px;">');
						output.push('\t\t\t\t<span style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 10px;">' + I("No images have been uploaded to the area file archive.") + '</span>');
						output.push("\t\t\t</td>");
					}

					for( var i = 0; i < editor.___fileArchiveImages.length; i++ ) {
						var image = editor.___fileArchiveImages[i];
						if( image.value != "" && image.value.match(/\.(?:jpg|png|gif|jpeg|tiff)/gi) ){
							output.push('\t\t\t<td style="padding-left: 5px; padding-top: 5px; padding-bottom: 5px;">');
							output.push('\t\t\t\t<table border="0" cellspacing="0" cellpadding="0" style="width: 128px; height: 128px;">');
							output.push("\t\t\t\t\t<tr>");
							if( i == 0 ) {
								output.push('\t\t\t\t\t\t<td id="cention_image_first_item" align="center" style="width: 128px; height: 128px; border-radius: 5px 5px 5px 5px; border: 1px solid #A3D7FF;" onclick="CKEDITOR.tools.callFunction(', selectFunction, ', this);return false;">');
							} else {
								output.push('\t\t\t\t\t\t<td align="center" style="width: 128px; height: 128px; border-radius: 5px 5px 5px 5px; border: 1px solid #A3D7FF;" onclick="CKEDITOR.tools.callFunction(', selectFunction, ', this);return false;">');
							}
							output.push('\t\t\t\t\t\t\t<img src="', image.download, '" style="max-width: 120px; max-height: 120px;">');
							output.push("\t\t\t\t\t\t</td>");
							output.push("\t\t\t\t\t</tr>");
							output.push("\t\t\t\t</table>");
							output.push("\t\t\t</td>")
						}
					}

					output.push("\t\t</tr>");
					output.push("\t</table>");
					output.push("</div>");
					output.push('<table border="0" cellspacing="0" cellpadding="0" style=" background: none repeat scroll 0 0 #F2F2F2; border-top: 1px solid #A5A5A5; margin-top: 0px;">');
					output.push("\t<tr>");
					output.push('\t\t<td style="width: 100%;"></td>');
					output.push('\t\t<td style="height: 20px; padding: 5px; cursor: pointer; white-space: nowrap;" onclick="CKEDITOR.tools.callFunction(', insertFunction, ');return false;">');
					output.push('\t\t\t<table border="0" cellspacing="0" cellpadding="0">');
					output.push("\t\t\t\t<tr>");
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;</td>');

					if( editor.___fileArchiveImages.length != 0 ) {
						output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(150, 215, 84); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;"><img border="0" src="/Cention.app/Resources/Images/submit_infoga.png" style="vertical-align: top;"></td>');
						output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; white-space: nowrap; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;<span style="vertical-align: middle; color: rgb(113, 113, 113);">' + I('Insert') + '</span>&nbsp;&nbsp;</td>');
					}

					output.push("\t\t\t\t</tr>");
					output.push("\t\t\t</table>");
					output.push("\t\t</td>");
					output.push('\t\t<td style="height: 20px; padding: 5px; cursor: pointer; white-space: nowrap;" onclick="CKEDITOR.tools.callFunction(', cancelFunction, ');return false;">');
					output.push('\t\t\t<table border="0" cellspacing="0" cellpadding="0">');
					output.push("\t\t\t\t<tr>");
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;</td>');
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(252, 171, 70); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;"><img border="0" src="/Cention.app/Resources/Images/submit_arrow_right.png" style="vertical-align: top;"></td>');
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; white-space: nowrap; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;<span style="vertical-align: middle; color: rgb(113, 113, 113);">' + I('Cancel') + '</span>&nbsp;&nbsp;</td>');
					output.push("\t\t\t\t</tr>");
					output.push("\t\t\t</table>");
					output.push("\t\t</td>");
					output.push("\t</tr>");
					output.push("</table>");
					return output.join("");
				}());

				CKEDITOR.ui.fire("ready", this);
			}
		})
	}
});