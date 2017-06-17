/**
*
*
* 颜色
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Color(fn) {
		if(!this instanceof Color) return new Color(fn);
		this.name = "Color";
		fn.call(Object.create(null), this);
	}

	Color.prototype = {
		constructor: Color
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["color"] = Color;
}(void(0)));