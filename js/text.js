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
	var x ,y;
	function Text(fn) {
		if (!this instanceof Text) return new Text(fn);
		this.name = "Text";
		fn.call(Object.create(null), this);
	};
	function handleInput(x,y) {
		var _input = document.getElementsByTagName('input')[0];
		if (!_input.getAttribute('isInit')) {
			_input.setAttribute('isInit', true);
			_input.style.top = y + 'px';
			_input.style.left = x + 'px';
		} else {
			_input.setAttribute('isInit', '');
			_input.value = '';
			_input.style.top = '-10000px';
			_input.style.left = '-10000px';
		}
	};
	function drawText(text, color) {
		document.getElementsByClassName('main-can')[0].getContext("2d").font = "12px serif";
		document.getElementsByClassName('main-can')[0].getContext("2d").fillStyle = color;
		document.getElementsByClassName('main-can')[0].getContext("2d").fillText(text, x, y);
		document.getElementById('panInput').value = '';
		document.getElementsByTagName('input')[0].style.top = '-10000px';
		document.getElementsByTagName('input')[0].style.left = '-10000px';
		store.save(document.getElementsByClassName('main-can')[0]);
	}
	document.addEventListener('keyup', function (e) {
		var key = e.keyCode || '';
		var _color = document.querySelector('#panColor').value;
		var text = '';
		if (key == 13) {
			text = document.getElementById('panInput').value;
			drawText(text, _color);
		}
	});
	
	Text.prototype = {
		constructor: Text,
		mousedown: function () {
			var e = arguments[0] || window.event,
				params = this.getParams(),
				bufferCanvas = this.getBufferCanvas(),
				rect = bufferCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			x = e.clientX - rect.left, y = e.clientY - rect.top;
			handleInput(x, y);
		},
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["text"] = Text;
}(void (0)));