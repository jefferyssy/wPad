/**
*
*
* 空心圆
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function CircleStroke(fn) {
		if(!this instanceof CircleStroke) return new CircleStroke(fn);
		this.name = "CircleStroke";
		fn.call(Object.create(null), this);
	}

	CircleStroke.prototype = {
		constructor: CircleStroke
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["circleStroke"] = CircleStroke;
}(void(0)));