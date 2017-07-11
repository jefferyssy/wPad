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
	function isSelect(x, y, data) {
		if (data && data.length) {
			data.map(function (item, index) {
				var key = item.item;
				var param = item.data;
				switch (key) {
					case 'Circle':
						var circleX = param[1][0] - (param[1][0] - param[0][0]) / 2;
						var circleY = param[1][1] - (param[1][1] - param[0][1]) / 2;
						var circleR = Math.sqrt((Math.pow((param[1][0] - param[0][0]), 2) + Math.pow((param[1][1] - param[0][1]), 2))) / 2;
						var len = Math.sqrt((Math.pow((x - circleX), 2) + Math.pow((y - circleY), 2))) / 2;
						if (len < circleR) {
							document.querySelector('#panColor').value = item.color;
						}
						break;
					case 'Rect':
						var startX = param[0][0];
						var startY = param[0][1];
						var endX = param[1][0];
						var endY = param[1][1];
						var w = Math.abs(startX - endX);
						var h = Math.abs(startY - endY);
						if (x > startX && x < startX + w && y > startY && y < startY + h) {
							document.querySelector('#panColor').value = item.color;
						}
						break;
					case 'Ellipes':
						var startX = param[0][0];
						var startY = param[0][1];
						var endX = param[1][0];
						var endY = param[1][1];
						var a = Math.abs(endX - startX) * 2;
						var b = Math.abs(endY - startY) * 2;
						var deltaX = x - startX;
						var deltaY = y - startY;
						if ((deltaX * deltaX) / (a * a) + (deltaY * deltaY) / (b * b) < 1) {
							document.querySelector('#panColor').value = item.color;
						}
						break;
				}
			});
		}
	}
	EyeDropper.prototype = {
		constructor: EyeDropper,
		mousedown: function () {
			var e = arguments[0] || window.event,
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			var data = this.getCache();
			isSelect(x, y, data);
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["eyeDropper"] = EyeDropper;
}(void (0)));