/**
*
*
* 空心椭圆
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function EllipesStroke(fn) {
		if(!this instanceof EllipesStroke) return new EllipesStroke(fn);
		this.name = "EllipesStroke";
		fn.call(Object.create(null), this);
	}

	EllipesStroke.prototype = {
		constructor: EllipesStroke
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["ellipesStroke"] = EllipesStroke;
}(void(0)));