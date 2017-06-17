/**
*
*
* 保存
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Save(fn) {
		if(!this instanceof Save) return new Save(fn);
		this.name = "Save";
		fn.call(Object.create(null), this);
	}

	Save.prototype = {
		constructor: Save
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["save"] = Save;
}(void(0)));