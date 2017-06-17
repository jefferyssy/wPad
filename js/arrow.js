/**
*
*
* 箭头
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Arrow(fn) {
		if(!this instanceof Arrow) return new Arrow(fn);
		this.name = "Arrow";
		fn.call(Object.create(null), this);
	}

	Arrow.prototype = {
		constructor: Arrow
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["arrow"] = Arrow;
}(void(0)));