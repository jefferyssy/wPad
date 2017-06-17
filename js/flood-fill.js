/**
*
*
* 填充工具
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function FloodFill(fn) {
		if(!this instanceof FloodFill) return new FloodFill(fn);
		this.name = "FloodFill";
		fn.call(Object.create(null), this);
	}

	FloodFill.prototype = {
		constructor: FloodFill
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["floodFill"] = FloodFill;
}(void(0)));