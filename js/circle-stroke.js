/**
*
*
* 空心圆
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	function CircleStroke(fn) {
		if (!this instanceof CircleStroke) return new CircleStroke(fn);
		this.name = "CircleStroke";
		fn.call(Object.create(null), this);
	}

	CircleStroke.prototype = {
		constructor: CircleStroke,
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
			console.log(JSON.stringify(data))
			switch (pointType) {
				case "begin":
					// bufferCtx.moveTo((data[0] * xs) >> 0, (data[1] * ys) >> 0);
					break;
				case "join":
					bufferCtx.beginPath();
					bufferCtx.arc(end_X-(end_X-start_X)/2, end_Y-(end_Y-start_Y)/2, Math.sqrt((Math.pow((end_X-start_X),2) + Math.pow((end_Y-start_Y),2)))/2 , 0, Math.PI*2, true); 
					bufferCtx.closePath();
					bufferCtx.stroke();
					break;
				default:
					mainCtx.beginPath();
					mainCtx.arc(end_X-(end_X-start_X)/2, end_Y-(end_Y-start_Y)/2,  Math.sqrt((Math.pow((end_X-start_X),2) + Math.pow((end_Y-start_Y),2)))/2 , 0, Math.PI*2, true); 
					mainCtx.closePath();
					mainCtx.stroke();
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["circlestroke"] = CircleStroke;
}(void (0)));