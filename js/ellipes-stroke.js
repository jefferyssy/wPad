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
	var config = {
		x: 10,
		y: 10
	};
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
					Math.abs(end_X - start_X) > Math.abs(end_Y - start_Y) ? (config.x = config.x + 1) : (config.y = config.y + 1);
					EllipseTwo(bufferCtx, end_X - (end_X - start_X) / 2, end_Y - (end_Y - start_Y) / 2, config.x, config.y);
					break;
				default:
					Math.abs(end_X - start_X) > Math.abs(end_Y - start_Y) ? (config.x = config.x + 1) : (config.y = config.y + 1);
					EllipseTwo(mainCtx, end_X - (end_X - start_X) / 2, end_Y - (end_Y - start_Y) / 2, config.x, config.y);
			}
			function EllipseTwo(context, x, y, a, b) {
                var r = (a > b) ? a : b;
                var ratioX = a / r;
                var ratioY = b / r;
				context.save();
				context.scale(ratioX, ratioY);
				context.beginPath();
				context.lineWidth = 2;
				context.strokeStyle = '#000';
				context.arc(x / ratioX, y / ratioY, r, 0, 2 * Math.PI, false);
				context.closePath();
				context.restore();
				context.stroke();
				console.log('圆心：'+x / ratioX+","+y / ratioY);
                console.log('半径：'+ratioX+","+ratioY);
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["ellipesstroke"] = EllipesStroke;
}(void (0)));