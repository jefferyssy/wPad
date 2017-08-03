/**
*
*
* 吸管工具
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	function EyeDropper(fn) {
		if (!this instanceof EyeDropper) return new EyeDropper(fn);
		this.name = "EyeDropper";
		fn.call(Object.create(null), this);
	}
	var listItem = [], lists = [];
	function getPiex(ctx, canvas) {
		lists = [];
		var piexArr = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
		for (var i = 0; i < piexArr.length; i++) {
			if (listItem.length != 4) {
				listItem.push(piexArr[i]);
			} else {
				lists.push(listItem);
				listItem = [];
				listItem.push(piexArr[i])
			}
		}
	};

	function piexColor(x, y) {
		var position = 1000 * (y - 1) + x;
		return {
			color: lists[position],
			index: position
		};
	}

	var rgbToHex = function (rgb) {
		var color = rgb.toString().match(/\d+/g);
		var hex = "#";

		for (var i = 0; i < 3; i++) {
			hex += ("0" + Number(color[i]).toString(16)).slice(-2);
		}
		return hex;
	};
	EyeDropper.prototype = {
		constructor: EyeDropper,
		mousedown: function () {
			var e = arguments[0] || window.event,
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				mainCanvas = this.getMainCanvas(),
				mainCtx = mainCanvas.getContext("2d");
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			var data = this.getCache();
			getPiex(mainCtx, mainCanvas);
			var result = piexColor(x, y);
			result.color.pop();
			document.querySelector('#panColor').value = rgbToHex(result.color.toString());
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["eyedropper"] = EyeDropper;
}(void (0)));