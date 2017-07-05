/**
*
*
* 导出
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	var type = "png",
		saveLink = document.createElement("A");

	function Export(fn) {
		if(!this instanceof Export) return new Export(fn);
		this.name = "Export";
		fn.call(Object.create(null), this);
	}

	var _export = function(data, filename) {
		saveLink.href = data;
		saveLink.download = filename;
		var event = document.createEvent("MouseEvents");
		event.initMouseEvent('click', true, false);
		saveLink.dispatchEvent(event);
	};

	Export.prototype = {
		constructor: Export,
		export: function() {
			var	mainCanvas = this.getMainCanvas(),
				imageData = mainCanvas.toDataURL(type);
			console.log(imageData);
			imageData = imageData.replace(/image\/\w+(?=;)/, "image/octet-stream");
			_export(imageData, Date.now()+"."+type);
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["export"] = Export;
}(void(0)));