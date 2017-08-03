/**
*
*
* 箭头
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	function Arrow(fn) {
		if (!this instanceof Arrow) return new Arrow(fn);
		this.name = "Arrow";
		fn.call(Object.create(null), this);
	}

	Arrow.prototype = {
		constructor: Arrow,
		mousedown: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				color = document.querySelector('#panColor').value;
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			params.draw.call(this, { item: this.item.name, color:color, pointType: "begin", data: [x, y], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
			this.item.startX = x;
			this.item.startY = y;
		},
		mousemove: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				x = e.clientX - rect.left,
				y = e.clientY - rect.top,
				color = document.querySelector('#panColor').value;
			this.draw({ item: this.item.name, color:color, pointType: "join", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
			params.draw.call(this, { item: this.item.name, color:color, pointType: "join", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
		},
		mouseup: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX,
			color = document.querySelector('#panColor').value;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			this.draw({ item: this.item.name, color:color, pointType: "end", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
			params.draw.call(this, { item: this.item.name, color:color, pointType: "end", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
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
				end_Y = _data[1][1],
				color = data.color;

			bufferCanvas.width = bufferCanvas.width;
			switch (pointType) {
				case "begin":
					break;
				case "join":
					drawArrow(bufferCtx,start_X,start_Y,end_X,end_Y,3,color);
					break;
				default:
					drawArrow(mainCtx,start_X,start_Y,end_X,end_Y,3,color);
					store.save(mainCanvas)
			}

			function drawArrow(ctx, fromx, fromy, tox, toy, arrowWidth, color) {
				//variables to be used when creating the arrow
				var headlen = 10;
				var angle = Math.atan2(toy - fromy, tox - fromx);

				ctx.save();
				ctx.strokeStyle = color;

				//starting path of the arrow from the start square to the end square
				//and drawing the stroke
				ctx.beginPath();
				ctx.moveTo(fromx, fromy);
				ctx.lineTo(tox, toy);
				ctx.lineWidth = arrowWidth;
				ctx.stroke();

				//starting a new path from the head of the arrow to one of the sides of
				//the point
				ctx.beginPath();
				ctx.moveTo(tox, toy);
				ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
					toy - headlen * Math.sin(angle - Math.PI / 7));

				//path from the side point of the arrow, to the other side point
				ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7),
					toy - headlen * Math.sin(angle + Math.PI / 7));

				//path from the side point back to the tip of the arrow, and then
				//again to the opposite side point
				ctx.lineTo(tox, toy);
				ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7),
					toy - headlen * Math.sin(angle - Math.PI / 7));

				//draws the paths created above
				ctx.stroke();
				ctx.restore();
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["arrow"] = Arrow;
}(void (0)));