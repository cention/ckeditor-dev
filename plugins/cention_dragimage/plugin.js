CKEDITOR.plugins.add("cention_dragimage", {
	init: function(b) {
		b.addFeature &&
		b.addFeature({
			allowedContent: "img[alt,id,!src]{width,height};"
		});
		b.on("contentDom", function() {
			var a = b.editable().$.parentNode;
			a.addEventListener && (a.addEventListener("dragenter", function(a) {
				a.stopPropagation();
				a.preventDefault()
			}, !1), a.addEventListener("dragover", function(a) {
				a.stopPropagation();
				a.preventDefault()
			}, !1), a.addEventListener("drop", function(a) {
				a.stopPropagation();
				a.preventDefault();
				a.dataTransfer && a.dataTransfer.files && Array.prototype.forEach.call(a.dataTransfer.files, function(e) {
					b.fire("drop", e);
				})
			}, !1))
		})
	}
});