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
	var lists = [], listItem = [];
	var leftX = '', rightX = '', startX = '', startY = '', originalX = '', originalY = '', _originalY = '';
	var init, _init;

	function FloodFill(fn) {
		if (!this instanceof FloodFill) return new FloodFill(fn);
		this.name = "FloodFill";
		fn.call(Object.create(null), this);
	}
	function getPiex(ctx, canvas) {
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

	function watch(ctx) {
		init = setInterval(function () {
			if (leftX != '' && rightX != '') {
				renderRect(ctx);
			}
		}, 1);
		_init = setInterval(function () {
			if (leftX != '' && rightX != '') {
				_renderRect(ctx);
			}
		}, 1);
	};

	function renderRect(ctx) {
		ctx.restore();
		ctx.fillStyle = '#dc143c';
		ctx.fillRect(startX, startY, rightX - leftX, 1);

		if (bottomYPoint(originalX, originalY--)) {
			leftXPoint(originalX, originalY);
			rightXPoint(originalX, originalY);
		} else {
			// clearInterval(init);
			leftX = '';
		}
	};

	function _renderRect(ctx) {
		ctx.restore();
		ctx.fillStyle = '#dc143c';
		ctx.fillRect(startX, startY, rightX - leftX, 1);

		if (bottomYPoint(originalX, _originalY++)) {
			leftXPoint(originalX, _originalY);
			rightXPoint(originalX, _originalY);
		} else {
			// clearInterval(_init);
			leftX = '';
		}
	};

	function leftXPoint(x, y) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() !== '0,0,0,255') {
			x--;
			leftXPoint(x, y);
		} else {
			startX = leftX = x;
			startY = y;
		}
	};

	function rightXPoint(x, y) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];

		if (color.toString() !== '0,0,0,255') {
			x++;
			rightXPoint(x, y);
		} else {
			rightX = x;
		}
	};

	function bottomYPoint(x, y) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		return color.toString() !== '0,0,0,255' ? true : false;
	};

	FloodFill.prototype = {
		constructor: FloodFill,
		mousedown: function () {
			var e = arguments[0] || window.event,
				mainCanvas = this.getMainCanvas(),
				canvasCtx = mainCanvas.getContext('2d'),
				rect = mainCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			originalX = x;
			_originalY = originalY = y;
			getPiex(canvasCtx, mainCanvas);
			watch(canvasCtx);
			leftXPoint(x, y);
			rightXPoint(x, y);
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["floodFill"] = FloodFill;
}(void (0)));