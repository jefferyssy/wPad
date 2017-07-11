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
				rect = bufferCanvas.getBoundingClientRect(),
				color = document.querySelector('#panColor').value;
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX-rect.left, y = e.clientY-rect.top;
			params.draw.call(this, {item:this.item.name, color:color, pointType:"begin", data:[x, y], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
			this.item.startX = x;
			this.item.startY = y;
		},
		mousemove: function() {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				x = e.clientX-rect.left,
				y = e.clientY-rect.top,
				color = document.querySelector('#panColor').value;
			this.draw({item:this.item.name, pointType:"join", color:color,data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
			params.draw.call(this, {item:this.item.name,  color:color, pointType:"join", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
		},
		mouseup: function() {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect(),
				color = document.querySelector('#panColor').value;
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX-rect.left, y = e.clientY-rect.top;
			this.draw({item:this.item.name, color:color,pointType:"end", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
			params.draw.call(this, {item:this.item.name, color:color, pointType:"end", data:[[this.item.startX, this.item.startY], [x, y]], width:bufferCanvas.width, height:bufferCanvas.height, time:Date.now()});
		},
		draw: function(param) {
			var pointType = param.pointType,
				mainCanvas = this.getMainCanvas(),
				bufferCanvas = this.getBufferCanvas(),
				mainCtx = mainCanvas.getContext("2d"),
				bufferCtx = bufferCanvas.getContext("2d"),
				xs = mainCanvas.width/param.width,
				ys = mainCanvas.height/param.height,
				data = param.data,
				color = param.color;
			console.log(data);
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
				mainCtx.strokeStyle = color;
				mainCtx.beginPath();
				mainCtx.moveTo((data[0][0]*xs)>>0, (data[0][1]*ys)>>0);
				mainCtx.lineTo((data[1][0]*xs)>>0, (data[1][1]*ys)>>0);
				mainCtx.closePath();
				mainCtx.stroke();
				store.save(mainCanvas)
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["line"] = Line;
}(void(0)));