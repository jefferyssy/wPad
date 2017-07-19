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
	window.leftArrs = [], window.rightArrs = [];
	var leftArr = [], rightArr = [];

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
		console.log(lists);
	};

	function renderRect(ctx, x, y) {
		ctx.restore();
		ctx.fillStyle = '#dc143c';
		ctx.fillRect(x, y, 1, 1);
	};

	function leftXPoint(ctx, x, y, tag) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() !== '0,0,0,255') {
			renderRect(ctx, x, y);
			x--;
			leftXPoint(ctx, x, y, tag);
		} else {
			x++;
			if (tag == 'bottom') {
				y++;
			} else {
				y--;
			}
			if (!isPoint(x, y)) {
				leftArr.push(x);
				leftArr.push(y);
				leftArrs.push(leftArr);
				leftArr = [];
				leftXPoint(ctx, x, y, tag);
			}
			// else{
			// 	y--;
			// 	x += 2;
			// 	if(x !== startX){
			// 		leftXPoint(ctx, x, y, tag);
			// 	}
				
			// }
		}
	};

	function rightXPoint(ctx, x, y, tag) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() !== '0,0,0,255') {
			renderRect(ctx, x, y);
			x++;
			rightXPoint(ctx, x, y, tag);
		} else {
			x--;
			if (tag == 'bottom') {
				y++;
			} else {
				y--;
			}
			if (!isPoint(x, y)) {
				rightArr.push(x);
				rightArr.push(y);
				rightArrs.push(rightArr);
				rightArr = [];
				rightXPoint(ctx, x, y, tag);
			} else {
				handlePoints(ctx);
			}
		}
	};

	function isPoint(x, y) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		return color.toString() == '0,0,0,255' ? true : false;
	};

	function drawLine(ctx, x, y, w) {
		ctx.restore();
		ctx.fillStyle = '#dc143c';
		ctx.fillRect(x, y, w, 1);
	};

	function handlePoints(ctx) {
		var len = (leftArrs.length > rightArrs.length) ? rightArrs.length : leftArrs.length;
		var flag = (leftArrs.length > rightArrs.length) ? true : false;

		for (var i = 0; i < len; i++) {
			drawLine(ctx, leftArrs[i][0], leftArrs[i][1], rightArrs[i][0] - leftArrs[i][0]);
		};
		if (leftArrs.length != rightArrs.length) {
			if (flag) {
				for (var i = len; i < leftArrs.length; i++) {
					var x = leftArrs[i][0], y = leftArrs[i][1];
					while (!isPoint(x, y)) {
						renderRect(ctx, x, y);
						x++;
					}
				}
			}else{
				for (var i = len; i < rightArrs.length; i++) {
					var x = rightArrs[i][0], y = rightArrs[i][1];
					while (!isPoint(x, y)) {
						renderRect(ctx, x, y);
						x--;
					}
				}
			}
		}
		// if (leftArrs.length) {
		// 	for (var i = len; i < leftArrs.length; i++) {
		// 		var x = leftArrs[i][0], y = leftArrs[i][1];
		// 		while (!isPoint(x, y)) {
		// 			renderRect(ctx, x, y);
		// 			x++;
		// 		}
		// 	}
		// } else {
		// 	for (var i = len; i < rightArrs.length; i++) {
		// 		var x = rightArrs[i][0], y = rightArrs[i][1];
		// 		while (!isPoint(x, y)) {
		// 			renderRect(ctx, x, y);
		// 			x--;
		// 		}
		// 	}
		// }

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
			startX = x;
			startY = y;
			getPiex(canvasCtx, mainCanvas);
			leftXPoint(canvasCtx, x, y, 'bottom');
			rightXPoint(canvasCtx, x, y, 'bottom');
			// leftXPoint(canvasCtx, x, y,'top');
			// rightXPoint(canvasCtx, x, y,'top');
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["floodFill"] = FloodFill;
}(void (0)));