/**
*
*
* 空心矩形
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function RectStroke(fn) {
		if(!this instanceof RectStroke) return new RectStroke(fn);
		this.name = "RectStroke";
		fn.call(Object.create(null), this);
	}

	RectStroke.prototype = {
		constructor: RectStroke
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["rectStroke"] = RectStroke;
}(void(0)));