/**
*
*
* 导入
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Import(fn) {
		if(!this instanceof Import) return new Import(fn);
		this.name = "Import";
		fn.call(Object.create(null), this);
	}

	Import.prototype = {
		constructor: Import
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["import"] = Import;
}(void(0)));