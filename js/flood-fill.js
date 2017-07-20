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
	var lists = [], listItem = [];
	var leftX = '', rightX = '', startX = '', startY = '', originalX = '', originalY = '', _originalY = '';
	window.leftArrs = [], window.rightArrs = [];
	var leftArr = [], rightArr = [];

	function FloodFill(fn) {
		if (!this instanceof FloodFill) return new FloodFill(fn);
		this.name = "FloodFill";
		fn.call(Object.create(null), this);
	}
	function getPiex(ctx, canvas) {
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
		// console.log(lists);
	};



	function renderRect(ctx, x, y) {
		ctx.restore();
		ctx.fillStyle = '#dc143c';
		ctx.fillRect(x, y, 1, 1);
	};



	window.allEdgePointArr = [];
	// var allEdgePointArr = [];

	// 鼠标点击区域的颜色 即填充面积的颜色
	var startColor = '255,255,255,255';

	// 获取第一个边缘点
	function getStartEdgePoint(ctx, x, y) {
		// console.log(x,y);
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() == startColor) {
			x--;
			getStartEdgePoint(ctx, x, y);
		} else {
			x++;
			createPointArr(x, y);
		}
	};

	//组边界点的数组
	function createPointArr(x, y) {
		var startEdgePoint = []
			startEdgePoint.push(x);
			startEdgePoint.push(y);
			console.log('startEdgePoint:', startEdgePoint);

			allEdgePointArr.push(startEdgePoint)
	};

	// 检测当前点的3个方向都可以通过  返回上一个点（数组的最后一个点）哪一个方向没有通过
	function testUnpass() {
		var lastArr, x, y, left, right, bottom, top;
		if (allEdgePointArr.length > 0) {
			lastArr  = allEdgePointArr[allEdgePointArr.length-2];
			x = lastArr[0];
			y = lastArr[1]; 
		} else {
			console.log('边界数组为空');
			return ;
		}

		var left = testOriginLeft(x, y);
		var right = testOriginRight(x, y);
		var top = testOriginTop(x, y);
		var bottom = testOriginBottom(x, y);

		if (!left) {
			return 'left';
		} else if (!right) {
			return 'right';
		} else if (!bottom) {
			return 'botton';
		} else if (!top) {
			return 'top'
		} else {
			return '呢马出错了'
		}
	};

	var index = 0; 

	 window.testColor = function (x, y) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		console.log(color.toString());
	}


	// @TODO 极端点  进去之后3个方向都返回 false         
	// @TODO 考虑进来点相反的  两个点都不可以的时候  处理方案
	// @TODO 考虑到画板的边界值  即 x || y 等于零的情况
	// 返回值作为源点  再次进行计算 并把值存放到全局数据 最后一个值就是  上一个点的值
	// 直到返回值等于  getStartEdgePoint() 循环结束
	function testOrigin (x, y, from) {
		// index++ ;
		// if (index == 600 ) {
		// 	// console.log(allEdgePointArr);
		// 	for (var i = 0; i < allEdgePointArr.length; i++) {
		// 		var x = allEdgePointArr[i][0], y = allEdgePointArr[i][1];
		// 		renderRect(cccccc, x, y);
		// 	}


		// 	return ;
		// }
		var firstArr = allEdgePointArr[0];
		// 因为起点也是结束点， 所有要判断数组长度大于一的
		if (allEdgePointArr.length > 1 && x == firstArr[0] && y == firstArr[1]) {
			// 拿到所有边界点数组  
			// 循环绘画填充
			for (var i = 0; i < allEdgePointArr.length; i++) {
				var x = allEdgePointArr[i][0], y = allEdgePointArr[i][1];
				renderRect(cccccc, x, y);
			}
			return ;
		}

		var left = false;
		var right = false;
		var top = false;
		var bottom = false;


		var oleft = testOriginLeft(x, y);
		var oright = testOriginRight(x, y);
		var otop = testOriginTop(x, y);
		var obottom = testOriginBottom(x, y);

		if (typeof oleft == 'object') {
			left = true;
		}

		if (typeof oright == 'object') {
			right = true;
		}

		if (typeof otop == 'object') {
			top = true;
		}

		if (typeof obottom == 'object') {
			bottom = true;
		}


		if (from == 'right') {
			// if(!top && !bottom){
			// 	// 如果上下都不行  那么返回
			// 	if(testUnpass() == 'top') { 
			// 		// return bottom;
			// 		testOrigin(obottom.point[0], obottom.point[1], 'top')
			// 		allEdgePointArr.push(obottom.point);
			// 	} else {
			// 		// return top;
			// 		testOrigin(otop.point[0], otop.point[1], 'bottom')
			// 		allEdgePointArr.push(otop.point);
			// 	}
			// }


			if (left && top && bottom) {
				// 检查top的左边不可以还是右边不可以 把不可以的返回
				if(testUnpass() == 'top') {
					// return 	top;
					allEdgePointArr.push(otop.point);
					testOrigin(otop.point[0], otop.point[1], 'boottom');
				} else {
					// return bottom;
					allEdgePointArr.push(obottom.point);
					testOrigin(obottom.point[0], obottom.point[1], 'top');
				}
			}

			if (!left && top && bottom) {
				// return top;
				allEdgePointArr.push(otop.point);
				testOrigin(otop.point[0], otop.point[1], 'bottom')
			}

			if (!left && !top && bottom) {
				// return bottom;
				allEdgePointArr.push(obottom.point);
				testOrigin(obottom.point[0], obottom.point[1], 'top')
			}

			if (left && !bottom && top) {
				// return left;
				allEdgePointArr.push(oleft.point);
				testOrigin(oleft.point[0], oleft.point[1], 'right')
				
			}

			if (!left && !bottom && top) {
				// return top;
				allEdgePointArr.push(otop.point);
				testOrigin(otop.point[0], otop.point[1], 'bottom')
				
			}

			if (left && bottom && !top) {
				// return left;
				allEdgePointArr.push(oleft.point);
				testOrigin(oleft.point[0], oleft.point[1], 'right');
				
			}
		}

		if (from == 'bottom') {
			// if(!left && !right && !top){
			// 	testOrigin(otop.point[0], otop.point[1], 'bottom')
			// 	allEdgePointArr.push(otop.point);
			// }

			if(!left && !right){
				// 如果上下都不行  那么返回
				if(testUnpass() == 'top') { 
					// return bottom;
					allEdgePointArr.push(obottom.point);
					testOrigin(obottom.point[0], obottom.point[1], 'top');
				} else {
					// return top;
					allEdgePointArr.push(otop.point);
					testOrigin(otop.point[0], otop.point[1], 'bottom');
				}
			}


			if (left && right && top) {
				// 检查top的左边不可以还是右边不可以 把不可以的返回
				if(testUnpass() == 'right') {
					// return 	right;
					allEdgePointArr.push(oright.point);
					testOrigin(oright.point[0], oright.point[1], 'left');
				} else {
					// return left;
					allEdgePointArr.push(oleft.point);
					testOrigin(oleft.point[0], oleft.point[1], 'right');
				}
			}

			if (!left && top && bottom) {
				// return top;
				allEdgePointArr.push(otop.point);
				testOrigin(otop.point[0], otop.point[1], 'bottom');
			}

			if (!left && !top && right) {
				// return right;
				allEdgePointArr.push(oright.point);
				testOrigin(oright.point[0], oright.point[1], 'left');
			}

			if (left && top && !right) {
				// return top;
				allEdgePointArr.push(otop.point);
				testOrigin(otop.point[0], otop.point[1], 'bottom');
			}
		}

		if (from == 'top') {
			if (right && bottom && left) {
				// 检查top的左边不可以还是右边不可以 把不可以的返回
				if(testUnpass() == 'right') {
					// return 	right;
					allEdgePointArr.push(oright.point);
					testOrigin(oright.point[0], oright.point[1], 'left');
				} else {
					// return left;
					allEdgePointArr.push(oleft.point);
					testOrigin(oleft.point[0], oleft.point[1], 'right');
				}	
			}

			if (!right && bottom && left) {
				// return  bottom;
				allEdgePointArr.push(obottom.point);
				testOrigin(obottom.point[0], obottom.point[1], 'top');
			}

			if (!right && !bottom && left) {
				// return left;
				allEdgePointArr.push(oleft.point);
				testOrigin(oleft.point[0], oleft.point[1], 'right');
			}

			if (right && bottom && !left) {
				// return bottom;
				allEdgePointArr.push(obottom.point);
				testOrigin(obottom.point[0], obottom.point[1], 'top');
			}

			if (right && !bottom && !left) {
				// return right;
				allEdgePointArr.push(oright.point);
				testOrigin(oright.point[0], oright.point[1], 'left');
			}

			if(right && bottom && !left) {
				// return bottom;
				allEdgePointArr.push(obottom.point);
				testOrigin(obottom.point[0], obottom.point[1], 'top');
			}

		}

		if(from == 'left') {
			if (top && right && bottom) {
				if(testUnpass() == 'bottom') {
					// return 	bottom;
					allEdgePointArr.push(obottom.point);
					testOrigin(obottom.point[0], obottom.point[1], 'top');
				} else {
					// return top;
					allEdgePointArr.push(otop.point);
					testOrigin(otop.point[0], otop.point[1], 'bottom');
				}
			}

			if (!top && right && bottom) {
				// return right;
				allEdgePointArr.push(oright.point);
				testOrigin(oright.point[0], oright.point[1], 'left');
			}

			if (!top && !right && bottom) {
				// return bottom;
				allEdgePointArr.push(obottom.point);
				testOrigin(obottom.point[0], obottom.point[1], 'top');
			}

			if (top && right && !bottom) {
				// return right;
				allEdgePointArr.push(oright.point);
				testOrigin(oright.point[0], oright.point[1], 'left');
			}

			if (top && !right && !bottom) {
				// return top;
				allEdgePointArr.push(otop.point);
				testOrigin(otop.point[0], otop.point[1], 'bottom');
			}

			if (top && right && !bottom) {
				// return right;
				allEdgePointArr.push(oright.point);
				testOrigin(oright.point[0], oright.point[1], 'left');
			}

		}

		// console.log('一个都没有进来')
	}

	

	// 传进来的点都是源点的坐标   也就是数组中最后一个值
	function testOriginLeft (x, y) {
		x--;
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() == startColor) {
			return {
				point: [x, y],
				from: 'left',
				state: true
			}
		} else {
			return false;
		}
	};

	function testOriginRight (x, y) {
		x++;
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() == startColor) {
			return {
				point: [x, y],
				from: 'right',
				state: true
			}
		} else {
			return false;
		}
	}

	function testOriginTop (x, y) {
		y--;
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() == startColor) {
			return {
				point: [x, y],
				from: 'top',
				state: true
			}
		} else {
			return false;
		}
	}

	function testOriginBottom (x, y) {
		y++;
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() == startColor) {
			return {
				point: [x, y],
				from: 'bottom',
				state: true
			}
		} else {
			return false;
		}
	}


	function leftXPoint(ctx, x, y, tag) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() !== '0,0,0,255') {
			renderRect(ctx, x, y);
			x--;
			leftXPoint(ctx, x, y, tag);
		} else {
			x++;
			if (tag == 'bottom') {
				y++;
			} else {
				y--;
			}
			if (!isPoint(x, y)) {
				leftArr.push(x);
				leftArr.push(y);
				leftArrs.push(leftArr);
				leftArr = [];
				leftXPoint(ctx, x, y, tag);
			}
			// else{
			// 	y--;
			// 	x += 2;
			// 	if(x !== startX){
			// 		leftXPoint(ctx, x, y, tag);
			// 	}
				
			// }
		}
	};

	function rightXPoint(ctx, x, y, tag) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		if (color.toString() !== '0,0,0,255') {
			renderRect(ctx, x, y);
			x++;
			rightXPoint(ctx, x, y, tag);
		} else {
			x--;
			if (tag == 'bottom') {
				y++;
			} else {
				y--;
			}
			if (!isPoint(x, y)) {
				rightArr.push(x);
				rightArr.push(y);
				rightArrs.push(rightArr);
				rightArr = [];
				rightXPoint(ctx, x, y, tag);
			} else {
				handlePoints(ctx);
			}
		}
	};

	function isPoint(x, y) {
		var position = 1000 * (y - 1) + x;
		var color = lists[position];
		return color.toString() == '0,0,0,255' ? true : false;
	};

	function drawLine(ctx, x, y, w) {
		ctx.restore();
		ctx.fillStyle = '#dc143c';
		ctx.fillRect(x, y, w, 1);
	};

	function handlePoints(ctx) {
		var len = (leftArrs.length > rightArrs.length) ? rightArrs.length : leftArrs.length;
		var flag = (leftArrs.length > rightArrs.length) ? true : false;

		for (var i = 0; i < len; i++) {
			drawLine(ctx, leftArrs[i][0], leftArrs[i][1], rightArrs[i][0] - leftArrs[i][0]);
		};
		if (leftArrs.length != rightArrs.length) {
			if (flag) {
				for (var i = len; i < leftArrs.length; i++) {
					var x = leftArrs[i][0], y = leftArrs[i][1];
					while (!isPoint(x, y)) {
						renderRect(ctx, x, y);
						x++;
					}
				}
			}else{
				for (var i = len; i < rightArrs.length; i++) {
					var x = rightArrs[i][0], y = rightArrs[i][1];
					while (!isPoint(x, y)) {
						renderRect(ctx, x, y);
						x--;
					}
				}
			}
		}
		// if (leftArrs.length) {
		// 	for (var i = len; i < leftArrs.length; i++) {
		// 		var x = leftArrs[i][0], y = leftArrs[i][1];
		// 		while (!isPoint(x, y)) {
		// 			renderRect(ctx, x, y);
		// 			x++;
		// 		}
		// 	}
		// } else {
		// 	for (var i = len; i < rightArrs.length; i++) {
		// 		var x = rightArrs[i][0], y = rightArrs[i][1];
		// 		while (!isPoint(x, y)) {
		// 			renderRect(ctx, x, y);
		// 			x--;
		// 		}
		// 	}
		// }

	};

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
			getPiex(canvasCtx, mainCanvas);

			getStartEdgePoint(canvasCtx, x, y);

			window.cccccc = canvasCtx;
			// 从第一个边界点开始找
			if (allEdgePointArr.length > 0) {
				lastArr  = allEdgePointArr[allEdgePointArr.length-1];
				x = lastArr[0];
				y = lastArr[1]; 
				testOrigin(x, y, 'right');
			} else {
				console.log('边界数组为空');
				return ;
			}

			

			// leftXPoint(canvasCtx, x, y, 'bottom');
			// rightXPoint(canvasCtx, x, y, 'bottom');
			// leftXPoint(canvasCtx, x, y,'top');
			// rightXPoint(canvasCtx, x, y,'top');
		}
	};

	window.vm = window.vm || {};
	window.vm.module = window.vm.module || {};
	window.vm.module["floodFill"] = FloodFill;
}(void (0)));