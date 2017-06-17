/**
*
*
* 截图工具
* @Author Jason
* @Date 2017-5-11
*
*
*/
;(function() {
	function Scissors(fn) {
		if(!this instanceof Scissors) return new Scissors(fn);
		this.name = "Scissors";
		fn.call(Object.create(null), this);
	}

	Scissors.prototype = {
		constructor: Scissors
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["scissors"] = Scissors;
}(void(0)));