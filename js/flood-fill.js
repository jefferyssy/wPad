/**
*
*
* 填充工具
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
	var listItem = [], lists = [];
	window._stack = [];//堆栈
	var xLeft , xRight;
	var originPiex = {};
	var startX , startY;

	window.floodFill = {
		getPiex: function (canvas, ctx) {
			var piexArr = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
			for (var i = 0; i < piexArr.length; i++) {
				if (listItem.length != 4) {
					listItem.push(piexArr[i]);
				} else {
					lists.push(listItem);
					listItem = [];
					listItem.push(piexArr[i])
				}
			}
		},
		piexColor: function (x, y) {
			var position = 1000 * (y - 1) + x;
			return {
				color: lists[position],
				index: position
			};
		},
		fillRect:function(ctx,x,y){
			ctx.restore();
			ctx.fillStyle = '#dc143c';
			ctx.fillRect(x, y, 1, 1);
		},
		fillToLeft:function(ctx,x,y){
			var target = this.piexColor(x,y);
			if(target.color.toString() !== '0,0,0,255'){
				this.fillRect(ctx,x,y);
				x--;
				this.fillToLeft(ctx,x,y);
			}else{
				xLeft = x + 1;
			}
			return xLeft;
		},
		fillToRight:function(ctx,x,y){
			var target = this.piexColor(x,y);
			if(target.color.toString() !== '0,0,0,255'){
				this.fillRect(ctx,x,y);
				x++;
				this.fillToRight(ctx,x,y);
			}else{
				xRight = x - 1;
			}
			return xRight;
		},
		getStackPiex:function(xLeft,xRight,y){
			var i = xLeft;
			while(i<=xRight && _stack.length == 0){
			// while(i<=xRight){
				var target = this.piexColor(i,y);
				if(target.color.toString() == '0,0,0,255'){
					i++;
				}else{
					originPiex = {};
					originPiex['x'] = i;
					originPiex['y'] = y;
					_stack.push(originPiex);
				}
			}
		},
		fillShap:function(ctx){
			while(_stack.length != 0){
				var x = _stack[0].x,y = _stack[0].y;
				_stack.pop();
				xLeft = this.fillToLeft(ctx,x,y);
				xRight = this.fillToRight(ctx,x,y);
			
				this.getStackPiex(xLeft,xRight,y - 1);
			}
			if(_stack.length == 0){
				originPiex = {};
				originPiex['x'] = startX;
				originPiex['y'] = startY;
				_stack.push(originPiex);
				while(_stack.length != 0){
					var x = _stack[0].x,y = _stack[0].y;
					_stack.pop();
					xLeft = this.fillToLeft(ctx,x,y);
					xRight = this.fillToRight(ctx,x,y);
					this.getStackPiex(xLeft,xRight,y + 1);
				}
			}
		}
	};

	function FloodFill(fn) {
		if (!this instanceof FloodFill) return new FloodFill(fn);
		this.name = "FloodFill";
		fn.call(Object.create(null), this);
	}

	FloodFill.prototype = {
		constructor: FloodFill,
		mousedown: function () {
			var e = arguments[0] || window.event,
				mainCanvas = this.getMainCanvas(),
				canvasCtx = mainCanvas.getContext('2d'),
				rect = mainCanvas.getBoundingClientRect();
			rect.top = rect.top + window.scrollY;
			rect.left = rect.left + window.scrollX;
			var x = e.clientX - rect.left, y = e.clientY - rect.top;
			startX = x;
			startY = y;
			originPiex = {};
			originPiex['x'] = x;
			originPiex['y'] = y;
			_stack.push(originPiex);
			floodFill.getPiex(mainCanvas, canvasCtx);
			floodFill.fillShap(canvasCtx)
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["floodfill"] = FloodFill;
}(void (0)));