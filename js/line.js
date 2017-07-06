/**
*
*
* 直线
* @Author Jason
* @Date 2017-5-11
*
*
*/

//*****************************************************
//*****************************************************
//*****************************************************
//*****************************************************
//*****************************************************
;(function() {
	function Line(fn) {
		if(!this instanceof Line) return new Line(fn);
		this.name = "Line";
		fn && fn.call(Object.create(null), this);
	}

	Line.prototype = {
		constructor: Line,
		mousedown: function() {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX-rect.left, y = e.clientY-rect.top;
			params.draw.call(this, {item:this.item.name, pointType:"begin", data:[x, y], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
			this.item.startX = x;
			this.item.startY = y;
		},
		mousemove: function() {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				x = e.clientX-rect.left,
				y = e.clientY-rect.top;
			this.draw({item:this.item.name, pointType:"join", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
			params.draw.call(this, {item:this.item.name, pointType:"join", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
		},
		mouseup: function() {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX-rect.left, y = e.clientY-rect.top;
			this.draw({item:this.item.name, pointType:"end", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
			params.draw.call(this, {item:this.item.name, pointType:"end", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
		},
		draw: function(data) {
			var pointType = data.pointType,
				mainCanvas = this.getMainCanvas(),
				bufferCanvas = this.getBufferCanvas(),
				mainCtx = mainCanvas.getContext("2d"),
				bufferCtx = bufferCanvas.getContext("2d"),
				xs = mainCanvas.width/data.width,
				ys = mainCanvas.height/data.height,
				data = data.data;

			bufferCanvas.width = bufferCanvas.width;
			switch(pointType) {
			case "begin":
				bufferCtx.moveTo((data[0]*xs)>>0, (data[1]*ys)>>0);
				break;
			case "join":
				bufferCtx.moveTo((data[0][0]*xs)>>0, (data[0][1]*ys)>>0);
				bufferCtx.lineTo((data[1][0]*xs)>>0, (data[1][1]*ys)>>0);
				bufferCtx.stroke();
				break;
			default:
				mainCtx.moveTo((data[0][0]*xs)>>0, (data[0][1]*ys)>>0);
				mainCtx.lineTo((data[1][0]*xs)>>0, (data[1][1]*ys)>>0);
				mainCtx.stroke();
				mainCtx.save();
				store.save(mainCanvas)
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["line"] = Line;
}(void(0)));