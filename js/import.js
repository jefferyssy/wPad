/**
*
*
* 导入
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	function Import(fn) {
		if (!this instanceof Import) return new Import(fn);
		this.name = "Import";
		fn.call(Object.create(null), this);
	}

	Import.prototype = {
		constructor: Import,
		import: function () {
			var mainCanvas = this.getMainCanvas(),
				bufferCanvas = this.getBufferCanvas(),
				mainCtx = mainCanvas.getContext("2d"),
				bufferCtx = bufferCanvas.getContext("2d");
			var inputOne = document.getElementById('fileOne');
			inputOne.click();
			inputOne.onchange = function () {
				//1.获取选中的文件列表
				var fileList = inputOne.files;
				var file = fileList[0];
				//读取文件内容
				var reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = function (e) {
					//将结果显示到canvas
					var img = new Image();
					img.onload = function () {
						mainCtx.globalCompositeOperation="destination-over";
						mainCtx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
						store.save(mainCanvas);
						mainCtx.globalCompositeOperation="source-over";
					}
					img.src = reader.result;
				}
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["import"] = Import;
}(void (0)));