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
			var mainCanvas1 = document.querySelector('#pad1 .main-can'),
				mainCtx1 = mainCanvas1.getContext("2d");
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
						mainCtx1.globalCompositeOperation="destination-over";
						mainCtx1.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height);
						store.save(mainCanvas1);
						mainCtx1.globalCompositeOperation="source-over";
						
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