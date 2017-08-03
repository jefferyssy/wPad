/**
*
*
* 填充工具
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	var listItem = [], lists = [];
	window._stack = [];//堆栈
	var xLeft, xRight;
	var originPiex = {};
	var startX, startY, mainCanvas;
	var color = '',hexColor = '';

	window.floodFill = {
		getPiex: function (canvas, ctx) {
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
		},
		piexColor: function (x, y) {
			var position = 1000 * (y - 1) + x;
			return {
				color: lists[position],
				index: position
			};
		},
		canuse: function (x, y) {
			if (x <= 10 || y <= 30 || x >= mainCanvas.width - 10 || y >= mainCanvas.height - 10) {
				return false;
			}
			var target = this.piexColor(x, y);
			// if (!target.color || target.color.toString() == '0,0,0,255' || target.color.toString() == hexColor.toString()) {
			if (!target.color || target.color.toString() !== '0,0,0,0' || target.color.toString() == hexColor.toString()) {
				return false;
			}
			return true;

		},
		addColor: function (ctx, x, y) {
			ctx.restore();
			ctx.fillStyle = color;
			ctx.fillRect(x, y, 1, 1);
			var position = 1000 * (y - 1) + x;
			hexColor = this.hexToRgb(color).push('255');
			lists[position] = hexColor;
		},
		rgbToHex: function (rgb) {
			var color = rgb.toString().match(/\d+/g);
			var hex = "#";

			for (var i = 0; i < 3; i++) {
				hex += ("0" + Number(color[i]).toString(16)).slice(-2);
			}
			return hex;
		},
		hexToRgb: function (hex) {
			color = color.toUpperCase();
			　　var regexpHex = /^#[0-9a-fA-F]{3,6}$/;//Hex  
			　　if (regexpHex.test(color)) {
				　　　　var hexArray = new Array();
				　　　　var count = 1;
				　　　　for (var i = 1; i <= 3; i++) {
					　　　　　　if (color.length - 2 * i > 3 - i) {
						　　　　　　　　hexArray.push(Number("0x" + color.substring(count, count + 2)));
						　　　　　　　　count += 2;
					　　　　　　} else {
						　　　　　　　　hexArray.push(Number("0x" + color.charAt(count) + color.charAt(count)));
						　　　　　　　　count += 1;
					　　　　　　}
				　　　　}
				　　　　return hexArray;
			　　} else {
				　　　　return color;
			　　}
		},
		fillRect: function (ctx, x, y) {
			var self = this;
			if (!self.canuse(x, y)) {
				return false;
			}
			self.addColor(ctx, x, y);

			return [
				function () {
					return self.fillRect(ctx, x + 1, y);
				},
				function () {
					return self.fillRect(ctx, x - 1, y);
				},
				function () {
					return self.fillRect(ctx, x, y + 1);
				},
				function () {
					return self.fillRect(ctx, x, y - 1);
				}
			];
		},

		fillShap: function (canvas,ctx) {
			var arr = [];
			var value = this.fillRect(ctx, originPiex.x, originPiex.y);
			if (value) {
				arr.push.apply(arr, value);
			}

			var len = arr.length;
			while (len != 0) {
				var fn = arr[0]();
				if (fn) {
					arr.push(fn[0]);
					arr.push(fn[1]);
					arr.push(fn[2]);
					arr.push(fn[3]);
				}
				arr.shift();
				len = arr.length;
			}
			store.save(canvas);
		}
	};

	function FloodFill(fn) {
		if (!this instanceof FloodFill) return new FloodFill(fn);
		this.name = "FloodFill";
		fn.call(Object.create(null), this);
	}

	FloodFill.prototype = {
		constructor: FloodFill,
		mousedown: function () {
			mainCanvas = this.getMainCanvas();
			var e = arguments[0] || window.event,
				canvasCtx = mainCanvas.getContext('2d'),
				rect = mainCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			color = document.querySelector('#panColor').value;
			hexColor = floodFill.hexToRgb(color).push('255');
			startX = x;
			startY = y;
			originPiex = {};
			originPiex['x'] = x;
			originPiex['y'] = y;
			_stack.push(originPiex);
			floodFill.getPiex(mainCanvas, canvasCtx);
			floodFill.fillShap(mainCanvas,canvasCtx)
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["floodfill"] = FloodFill;
}(void (0)));