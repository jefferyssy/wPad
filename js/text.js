/**
*
*
* 文本
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Text(fn) {
		if(!this instanceof Text) return new Text(fn);
		this.name = "Text";
		fn.call(Object.create(null), this);
	}

	Text.prototype = {
		constructor: Text
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["text"] = Text;
}(void(0)));