/**
*
*
* 文本
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	function Text(fn) {
		if (!this instanceof Text) return new Text(fn);
		this.name = "Text";
		fn.call(Object.create(null), this);
	}
	var xInput, yInput;
	Text.prototype = {
		constructor: Text,
		mousedown: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			params.draw.call(this, { item: this.item.name,pointType: "begin", data: [x, y], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
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
				start_X = _data[0],
				start_Y = _data[1];
			var _input = document.getElementsByTagName('input')[0];

			switch (pointType) {
				case "begin":
					x = start_X,
					y = start_Y;
					if(!_input.getAttribute('isInit')){
						_input.setAttribute('isInit',true);
						_input.style.top = y + 'px';
						_input.style.left = x + 'px';
					}else{
						_input.setAttribute('isInit','');
						_input.value = '';
						_input.style.top = '-10000px';
						_input.style.left = '-10000px';
					}
					break;
				case "join":
					break;
				default:	
			}
			document.addEventListener('keyup', function (e) {
				var key = e.keyCode || '';
				var _color = document.querySelector('#panColor').value;
				var text = '';
				if (key == 13) {
					text = document.getElementById('panInput').value;
					drawText(text,_color);
				}
			});
			function drawText(text,color) {
				document.getElementsByClassName('main-can')[0].getContext("2d").font = "12px serif";
				document.getElementsByClassName('main-can')[0].getContext("2d").fillStyle  = color;
				document.getElementsByClassName('main-can')[0].getContext("2d").fillText(text, x, y);
				document.getElementsByClassName('main-can')[1].getContext("2d").font = "12px serif";
				document.getElementsByClassName('main-can')[1].getContext("2d").fillStyle  = color;
				document.getElementsByClassName('main-can')[1].getContext("2d").fillText(text, x, y);
				document.getElementById('panInput').value = '';
				document.getElementsByTagName('input')[0].style.top = '-10000px';
				document.getElementsByTagName('input')[0].style.left = '-10000px';
				store.save(document.getElementsByClassName('main-can')[0]);
			}
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["text"] = Text;
}(void (0)));