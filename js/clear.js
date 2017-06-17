/**
*
*
* 清除
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Clear(fn) {
		if(!this instanceof Clear) return new Clear(fn);
		this.name = "Clear";
		fn.call(Object.create(null), this);
	}

	Clear.prototype = {
		constructor: Clear
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["clear"] = Clear;
}(void(0)));