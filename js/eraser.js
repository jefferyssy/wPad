/**
*
*
* 橡皮擦
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Eraser(fn) {
		if(!this instanceof Eraser) return new Eraser(fn);
		this.name = "Eraser";
		fn.call(Object.create(null), this);
	}

	Eraser.prototype = {
		constructor: Eraser
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["eraser"] = Eraser;
}(void(0)));