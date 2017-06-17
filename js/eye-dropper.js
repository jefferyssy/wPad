/**
*
*
* 吸管工具
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function EyeDropper(fn) {
		if(!this instanceof EyeDropper) return new EyeDropper(fn);
		this.name = "EyeDropper";
		fn.call(Object.create(null), this);
	}

	EyeDropper.prototype = {
		constructor: EyeDropper
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["eyeDropper"] = EyeDropper;
}(void(0)));