/**
*
*
* 实心椭圆
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Ellipes(fn) {
		if(!this instanceof Ellipes) return new Ellipes(fn);
		this.name = "Ellipes";
		fn.call(Object.create(null), this);
	}

	Ellipes.prototype = {
		constructor: Ellipes
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["ellipes"] = Ellipes;
}(void(0)));