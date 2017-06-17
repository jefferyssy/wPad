/**
*
*
* 撤消
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Undo(fn) {
		if(!this instanceof Undo) return new Undo(fn);
		this.name = "Undo";
		fn.call(Object.create(null), this);
	}

	Undo.prototype = {
		constructor: Undo
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["undo"] = Undo;
}(void(0)));