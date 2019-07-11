CKEDITOR.plugins.add("cention_image", {
	requires: "panelbutton,floatpanel",

	icons: "image",

	init: function( editor ) {
		editor.ui.add("Image", CKEDITOR.UI_PANELBUTTON, {
			label: I("Image"),
			title: I("Image (Support only jpg, png, gif, jpeg, tiff)"),
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
			insertIcon: this.path + "icons/submit_infoga.png",
			cancelIcon: this.path + "icons/submit_arrow_right.png",
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

								if(editor.wrapImageInContainer){
									var imgContainer = editor.document.createElement("div");
									imgContainer.setAttribute("class", "imgPreviewContainer");
									var imgPreviewLink = editor.document.createElement("a");
									imgPreviewLink.setAttribute("class", "imgPreviewLink");
									imgPreviewLink.setAttribute("data-lightbox", "imgPreviewLink");
									imgPreviewLink.setAttribute("href", selectedImg.getAttribute("src"));
									imgPreviewLink.$.appendChild(img.$);
									imgContainer.$.appendChild(imgPreviewLink.$);
									editor.insertElement(imgContainer);
								} else {
									editor.insertElement(img);
								}


								editor.fire("saveSnapshot");
							}
						});
					output.push('<div style="width: 450px; overflow-x: auto;">');
					output.push('\t<table border="0" cellspacing="0" cellpadding="0">');
					output.push("\t\t<tr>");
					var host = location.protocol + "//" + location.hostname;
					var hasSupportedImage = false;
					if(editor.___fileArchiveImages && editor.___fileArchiveImages.length > 0){
						editor.___fileArchiveImages.forEach(function(image){
							var isFirstItem = false;
							if( (image.value != null && image.value != "" && image.value.match(/\.(?:jpg|png|gif|jpeg|tiff)/gi)) || (image.name != null && image.name != "" && image.name.match(/\.(?:jpg|png|gif|jpeg|tiff)/gi))){
								hasSupportedImage = true;
								output.push('\t\t\t<td style="padding-left: 5px; padding-top: 5px; padding-bottom: 5px;">');
								output.push('\t\t\t\t<table border="0" cellspacing="0" cellpadding="0" style="width: 128px; height: 128px;">');
								output.push("\t\t\t\t\t<tr>");
								if( !isFirstItem ) {
									isFirstItem = true;
									output.push('\t\t\t\t\t\t<td id="cention_image_first_item" align="center" style="width: 128px; height: 128px; border-radius: 5px 5px 5px 5px; border: 1px solid #A3D7FF;" onclick="CKEDITOR.tools.callFunction(', selectFunction, ', this);return false;">');
								} else {
									output.push('\t\t\t\t\t\t<td align="center" style="width: 128px; height: 128px; border-radius: 5px 5px 5px 5px; border: 1px solid #A3D7FF;" onclick="CKEDITOR.tools.callFunction(', selectFunction, ', this);return false;">');
								}
								var src = (image.download ? image.download : (image.src ? image.src : ""));
								if(src !== "") src = host +""+ src;
								output.push('\t\t\t\t\t\t\t<img src="', src , '" style="max-width: 120px; max-height: 120px;">');
								output.push("\t\t\t\t\t\t</td>");
								output.push("\t\t\t\t\t</tr>");
								output.push("\t\t\t\t</table>");
								output.push("\t\t\t</td>")
							}
						});
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

					if( hasSupportedImage ) {
						output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(150, 215, 84); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;"><img border="0" src="'+ this.insertIcon +'" style="vertical-align: top;"></td>');
						output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; white-space: nowrap; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;<span style="vertical-align: middle; color: rgb(113, 113, 113);">' + I('Insert') + '</span>&nbsp;&nbsp;</td>');
					}else{
						output.push('\t\t\t<td style="padding-left: 5px; padding-top: 5px; padding-bottom: 5px;">');
						output.push('\t\t\t\t<span style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 10px;">' + I("No images have been uploaded to the area file archive.") + '</span>');
						output.push("\t\t\t</td>");
					}

					output.push("\t\t\t\t</tr>");
					output.push("\t\t\t</table>");
					output.push("\t\t</td>");
					output.push('\t\t<td style="height: 20px; padding: 5px; cursor: pointer; white-space: nowrap;" onclick="CKEDITOR.tools.callFunction(', cancelFunction, ');return false;">');
					output.push('\t\t\t<table border="0" cellspacing="0" cellpadding="0">');
					output.push("\t\t\t\t<tr>");
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;</td>');
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; background: none repeat scroll 0% 0% rgb(252, 171, 70); font-size: 10px; font-family: Verdana, Arial, Helvetica, sans-serif;"><img border="0" src="'+ this.cancelIcon +'" style="vertical-align: top;"></td>');
					output.push('\t\t\t\t\t<td style="border: 0px none; padding: 0px; white-space: nowrap; background: none repeat scroll 0% 0% rgb(242, 242, 242); font-size: 12px; font-family: Verdana, Arial, Helvetica, sans-serif;">&nbsp;<span style="vertical-align: middle; color: rgb(113, 113, 113);">' + I('Cancel') + '</span>&nbsp;&nbsp;</td>');
					output.push("\t\t\t\t</tr>");
					output.push("\t\t\t</table>");
					output.push("\t\t</td>");
					output.push("\t</tr>");
					output.push("</table>");
					return output.join("");
				}.bind(this)());

				CKEDITOR.ui.fire("ready", this);
			}
		})
	}
});
