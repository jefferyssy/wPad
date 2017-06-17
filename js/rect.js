/**
*
*
* 实心矩形
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Rect(fn) {
		if(!this instanceof Rect) return new Rect(fn);
		this.name = "Rect";
		fn.call(Object.create(null), this);
	}

	Rect.prototype = {
		constructor: Rect
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["rect"] = Rect;
}(void(0)));