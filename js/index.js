/**
*
*
* 白板入口文件
* @Author Jason
* @Date 2017-5-10
*
*
*/

//*****************************************************
//*****************************************************
//*****************************************************
//*****************************************************
//*****************************************************
; (function (undefined) {
	var vm = window.vm || {},
		trackCache = {},
		reCache = [],
		toString = Object.prototype.toString,
		imgNode = document.createElement("IMG"),
		ss = window.sessionStorage,
		ls = window.localStorage,
		defaultConfig = {
			name: "pad",
			wrap: document.body,
			layout: "left-top-horizontal",
			openLocalCache: true,
			toolbars: ["line", "arrow", "pen", "circle", "ellipes", "circlestroke", "ellipesstroke", "rect", "rectstroke", "eraser", "brush", "eyedropper", "text", "import", "export", "clear", "undo", "color", "save"],
			done: function () { }
		},
		titles = { line: "直线", arrow: "箭头", pen: "画笔", circle: "实心圆", ellipes: "实心椭圆", circlestroke: "空心圆", ellipesstroke: "空心椭圆", rect: "实心矩形", rectstroke: "空心矩形", eraser: "橡皮擦", brush: "笔刷", eyedropper: "取色工具", text: "文本", import: "插入图片", export: "导出", clear: "清空", undo: "撤销", color: "颜色", save: "保存" };

	vm.module = vm.module || {};
	window.vm = vm;
	var tpl = "	<div class='wPad-wrap $LAYOUT$'>\
					<ul class='toolbar-wrap'>$TOOLBARS$</ul>\
					<div class='canvas-wrap'>\
						<canvas class='can buffer-can' width='$MAINCANVASWIDTH$' height='$MAIINCANVASHEIGHT$'></canvas>\
						<canvas class='can main-can' width='$MAINCANVASWIDTH$' height='$MAIINCANVASHEIGHT$'>浏览器版本太低，暂不支持此功能，请更新！</canvas>\
					</div>\
				</div>";
	var toolbarTpl = "<li class='toolbar-item-wrap'><i item='$ITEM$' class='iconfont icon-$CLASS$' title='$TITLE$'>$TITLE$</i></li>";

	var addEvent = window.addEventListener ? function (target, type, fn, use) {
		if (!target || !type || !fn) return;
		target.addEventListener(type, fn, use || false);
	} : function (target, type, fn) {
		if (!target || !type || !fn) return;
		target.attachEvent("on" + type, fn);
	};

	function WPad(params) {
		if (!this instanceof WPad) return new WPad(params);
		this.name = params.name;
		var self = this, _module = {};
		this.getParams = function () { return params; };
		this.getModule = function (name) { return !name ? _module : _module[name]; };
		this.getCache = function () { return trackCache[self.name]; };
		this.getStore = function () { return store.undoList; };
		trackCache[self.name] = [];
		buildPad.call(this, function (name, m) { _module[name] = m; });
	}

	WPad.prototype = {
		constructor: WPad,
		draw: function (data, isCache) {
			if (!data) return;
			var self = this,
				toolName = data.item.toLowerCase(),
				tool = this.getModule(toolName);
			tool && tool.draw.call(this, data);
			if (-1 !== ["pen"].indexOf(toolName)) {
				!isCache && trackCache[self.name].push(data);
			} else {
				!isCache && "end" === data.pointType.toLowerCase() && trackCache[self.name].push(data);
			}
		},
		show:function(data){
			var self = this,
				mainCanvas = this.getMainCanvas();
			store.undoList = data;
			store.init(mainCanvas.getContext('2d'), self);
		},
		clear: function () {
			var self = this,
				mainCanvas = this.getMainCanvas(),
				mainCtx = mainCanvas.getContext("2d");
			trackCache[self.name] = [];
			store.undoList = [];
			ls.removeItem('storeList');
			mainCtx.clearRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight);
			store.clear();
		}
	};

	window.wPad = {
		init: function (_params) {
			if (!_params) return;
			var params = {};
			copy(defaultConfig, params);
			copy(_params, params);
			return new WPad(params);
		}
	};

	function buildPad(fn) {
		var self = this,
			params = this.getParams(),
			toolbars = params.toolbars,
			wrap = params.wrap,
			layout = params.layout,
			item = ss.getItem(self.name) || "line",
			str = "";

		var i = 0, count = 0, len = toolbars.length;
		if (len > i) {
			do {
				var toolbar = toolbars[i];

				if (toolbar && vm.module[toolbar.toLowerCase()]) {
					new vm.module[toolbar.toLowerCase()](function (m) {
						str += toolbarTpl.replace(/\$ITEM\$|\$CLASS\$/g, toolbar).replace(/\$TITLE\$/g, titles[toolbar] || "");
						fn.call(self, toolbar, m);
						count++;
						count >= len && "[object Function]" === toString.call(params.done) && params.done.call(self);
					});
				} else {
					count++;
					count >= len && "[object Function]" === toString.call(params.done) && params.done.call(self);
				}
			} while (++i < len)
		}

		var padStr = tpl.replace(/\$TOOLBARS\$/g, str).replace(/\$LAYOUT\$/g, layout)
			.replace(/\$MAINCANVASWIDTH\$/g, wrap.clientWidth)
			.replace(/\$MAIINCANVASHEIGHT\$/g, wrap.clientHeight);
		wrap.innerHTML = padStr;

		var toolbar = wrap.getElementsByClassName("toolbar-wrap")[0],
			mainCanvas = wrap.getElementsByClassName("main-can")[0],
			bufferCanvas = wrap.getElementsByClassName("buffer-can")[0],
			mainCtx = mainCanvas.getContext("2d");

		//笔刷添加钩子
		document.querySelector('[item=brush]').parentNode.setAttribute('data-type', 'J_brush');
		var Dom = document.querySelector('[data-type=J_brush]'),
			ulDom = document.querySelector('.brush-list');

		Dom.appendChild(ulDom);
		Dom.onmouseover = function () {
			ulDom.removeAttribute('class', 'none');
			ulDom.setAttribute('class', 'brush-list')
		};
		Dom.onmouseout = function () {
			ulDom.setAttribute('class', 'none');
		};
		var liDom = document.querySelector('[data-type=J_brush] .brush-list').children;
		for (var i = 0; i < liDom.length; i++) {
			liDom[i].onclick = function (e) {
				var brushWidth = this.innerText;
				document.querySelector('#brushWidth').value = brushWidth;
				Dom.childNodes[0].click();
			};
		}

		store.save(mainCanvas);
		addEvent(mainCanvas, "mousedown", function () {
			self.item.mousedown && self.item.mousedown.apply(self, [].slice.call(arguments, 0));
		});

		addEvent(mainCanvas, "mousemove", function () {
			var e = arguments[0] || window.event;
			1 === e.which && self.item.mousemove && self.item.mousemove.apply(self, [].slice.call(arguments, 0));
		});

		addEvent(mainCanvas, "mouseup", function () {
			self.item.mouseup && self.item.mouseup.apply(self, [].slice.call(arguments, 0));
		});

		addEvent(toolbar, "click", function () {
			var e = arguments[0] || window.event,
				item = e.srcElement.getAttribute("item") || e.target.getAttribute("item");

			if (item) {
				var tool = self.getModule()[item];

				if (tool) {
					var name = tool.name || "";
					if (!name) return;

					switch (name.toLowerCase()) {
						case "clear":
							self.clear();
							params.clear.call(self);
							break;
						case "export":
							tool.export.call(self);
							break;
						case "undo":
							store.undo(mainCanvas.getContext('2d'), self);
							// handleData(trackCache, self);
							break;
						case "color":
							var colorDom = document.querySelector('#panColor');
							colorDom.click();
							break;
						case "eyedropper":
							self.item = tool;
							break;
						case "import":
							self.item = tool;
							tool.import.call(self);
							break;
						case "floodfill":
							self.item = tool;
							break;
						default:
							self.item = tool;
							mainCanvas.setAttribute("item", name);
							ss.setItem(self.name, name.toLowerCase());
					}
				}
			}

			e.preventDefault();
			e.stopPropagation();
		});

		self.getMainCanvas = function () {
			return mainCanvas;
		};

		self.getBufferCanvas = function () {
			return bufferCanvas;
		};

		var tool = self.getModule()[item];
		if (tool) {
			self.item = tool;
			mainCanvas.setAttribute("item", tool.name);
		}

		//从storage获取数据渲染页面
		var _storeList = [], tmp;
		if (ls.getItem('storeList')) {
			tmp = ls.getItem('storeList').split('|');
			tmp.map(function (item, index) {
				if (item) {
					_storeList.push(JSON.parse(item));
				}
			});
			store.undoList = _storeList;
			store.init(mainCanvas.getContext('2d'), self);
		}
	}

	function copy(copyData, receiveData) {
		if ("[object Array]" === toString.call(copyData)) {
			var i = 0, len = copyData.length;
			if (len > i) {
				do {
					var d = copyData[i];

					if ("[object Array]" === toString.call(d) || "[object Object]" === toString.call(d)) {
						var data = "[object Array]" === toString.call(d) ? [] : {};
						copy(d, data);
						receiveData.push(data);
					} else {
						receiveData.push(d);
					}
				} while (++i < len)
			}
		} else {
			for (var key in copyData) {
				var d = copyData[key];

				if ("[object Array]" === toString.call(d) || "[object Object]" === toString.call(d)) {
					var data = "[object Array]" === toString.call(d) ? [] : {};
					copy(d, data);
					receiveData[key] = data;
				} else {
					receiveData[key] = d;
				}
			}
		}
	}

	// function handleData(data, self) {
	// 	var pad = data.pad1;
	// 	if (pad.length) {
	// 		reCache.push(pad.pop());
	// 		var mainCanvas = self.getMainCanvas(),
	// 			mainCtx = mainCanvas.getContext("2d");
	// 		mainCanvas.width = mainCanvas.width;
	// 		mainCtx.fillStyle = "#fff";
	// 		mainCtx.fillRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight);
	// 		if (pad.length) {
	// 			pad.map(function (item, index) {
	// 				var name = self.getModule(item.item.toLowerCase());
	// 				name.draw.call(self, item)
	// 			});
	// 		}

	// 	}
	// }

	//关闭tab时 保存数据
	addEvent(window, "beforeunload", function () {
		if (store.undoList.length) {
			var str = '';
			store.undoList.map(function (item, index) {
				str += JSON.stringify(item) + '|';
			});
			ls.setItem('storeList', str);
		}
	});
}());