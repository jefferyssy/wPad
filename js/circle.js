/**
*
*
* 实心圆
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Circle(fn) {
		if(!this instanceof Circle) return new Circle(fn);
		this.name = "Circle";
		fn.call(Object.create(null), this);
	}

	Circle.prototype = {
		constructor: Circle
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["circle"] = Circle;
}(void(0)));