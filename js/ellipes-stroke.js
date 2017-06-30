/**
*
*
* 空心椭圆
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	function EllipesStroke(fn) {
		if (!this instanceof EllipesStroke) return new EllipesStroke(fn);
		this.name = "EllipesStroke";
		fn.call(Object.create(null), this);
	}

	EllipesStroke.prototype = {
		constructor: EllipesStroke,
		mousedown: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			params.draw.call(this, { item: this.item.name, pointType: "begin", data: [x, y], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
			this.item.startX = x;
			this.item.startY = y;
		},
		mousemove: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top;
			this.draw({ item: this.item.name, pointType: "join", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
			params.draw.call(this, { item: this.item.name, pointType: "join", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
		},
		mouseup: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			this.draw({ item: this.item.name, pointType: "end", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
			params.draw.call(this, { item: this.item.name, pointType: "end", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
		},
		draw: function (data) {

			console.log(data);
			var pointType = data.pointType,
				mainCanvas = this.getMainCanvas(),
				bufferCanvas = this.getBufferCanvas(),
				mainCtx = mainCanvas.getContext("2d"),
				bufferCtx = bufferCanvas.getContext("2d"),
				xs = mainCanvas.width / data.width,
				ys = mainCanvas.height / data.height,
				_data = data.data,
				start_X = _data[0][0],
				start_Y = _data[0][1],
				end_X = _data[1][0],
				end_Y = _data[1][1];
            bufferCanvas.width = bufferCanvas.width;
			switch (pointType) {
				case "begin":
					break;
				case "join":
					Ellipse(bufferCtx, start_X, start_Y, Math.abs(end_X-start_X), Math.abs(end_Y - start_Y))
					break;
				default:
					Ellipse(mainCtx, start_X, start_Y, Math.abs(end_X-start_X), Math.abs(end_Y - start_Y))
			}


			/**
			 * 画椭圆
			 * 
			 * @param {obj} context 
			 * @param {int} x 起点X轴坐标 
			 * @param {int} y 起点Y轴坐标 
			 * @param {int} a 轴半距离
			 * @param {int} b 轴半距离
			 */
			function Ellipse(context, x, y, a, b) {
				var k = 0.5522848,
				ox = k * a,
				oy = k * b;

				context.save();
				context.translate(x, y);
				context.beginPath();
				context.moveTo(0, b);
				context.bezierCurveTo(ox, b, a, oy, a, 0);
				context.bezierCurveTo(a, -oy, ox, -b, 0, -b);
				context.bezierCurveTo(-ox, -b, -a, -oy, -a, 0);
				context.bezierCurveTo(-a, oy, -ox, b, 0, b);
				context.closePath();
				context.stroke();
				context.restore();
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["ellipesstroke"] = EllipesStroke;
}(void (0)));