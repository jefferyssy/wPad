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
			toolbars: ["line", "arrow", "pen", "circle", "ellipes", "circleStroke", "ellipesStroke", "rect", "rectStroke", "eraser", "floodFill", "eyeDropper", "text", "scissors", "import", "export", "clear", "undo", "color", "save"],
			done: function () { }
		},
		titles = { line: "直线", arrow: "箭头", pen: "画笔", circle: "实心圆", ellipes: "实心椭圆", circlestroke: "空心圆", ellipesstroke: "空心椭圆", rect: "实心矩形", rectstroke: "空心矩形", eraser: "橡皮擦", floodFill: "填充", eyeDropper: "取色工具", text: "文本", scissors: "截图", import: "插入图片", export: "导出", clear: "清除", undo: "撤销", color: "颜色", save: "保存" };

	vm.module = vm.module || {};
	window.vm = vm;
	var tpl = "	<div class='wPad-wrap $LAYOUT$'>\
					<ul class='toolbar-wrap'>$TOOLBARS$</ul>\
					<div class='canvas-wrap'>\
						<canvas class='can buffer-can' width='$MAINCANVASWIDTH$' height='$MAIINCANVASHEIGHT$'></canvas>\
						<canvas class='can main-can' width='$MAINCANVASWIDTH$' height='$MAIINCANVASHEIGHT$'>浏览器版本太低，暂不支持此功能，请更新！</canvas>\
					</div>\
				</div>";
	var toolbarTpl = "<li class='toolbar-item-wrap'><i item='$ITEM$' class='iconfont icon-$CLASS$' title='$TITLE$'></i></li>";

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
				// !isCache && trackCache[self.name].push(data);
				!isCache && "end" === data.pointType.toLowerCase() && trackCache[self.name].push(data);
			} else {
				!isCache && "end" === data.pointType.toLowerCase() && trackCache[self.name].push(data);
			}
		},	
		clear: function () {
			var self = this,
				mainCanvas = this.getMainCanvas(),
				mainCtx = mainCanvas.getContext("2d");
			mainCanvas.width = mainCanvas.width;
			trackCache[self.name] = [];
			mainCtx.fillStyle = "#fff";
			mainCtx.fillRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight);
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

				if (toolbar && vm.module[toolbar]) {
					new vm.module[toolbar](function (m) {
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

		mainCtx.fillStyle = "#fff";
		mainCtx.fillRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight);

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
							// store.undo(mainCanvas.getContext('2d'));
							handleData(trackCache, self);
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

		var _trackCache = JSON.parse(ls.getItem(self.name) || "[]");
		trackCache[self.name] = _trackCache;
		var i = 0, len = _trackCache.length;
		do {
			var data = _trackCache[i];
			data && self.draw(data, true);
		} while (++i < len);
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

	function handleData(data, self) {
		var pad2 = data.pad1;
		if (pad2.length) {
			reCache.push(pad2.pop());
			var mainCanvas = self.getMainCanvas(),
				mainCtx = mainCanvas.getContext("2d");
			mainCanvas.width = mainCanvas.width;
			mainCtx.fillStyle = "#fff";
			mainCtx.fillRect(0, 0, mainCanvas.clientWidth, mainCanvas.clientHeight);
			if (pad2.length) {
				pad2.map(function (item, index) {
					var name = self.getModule(item.item.toLowerCase());
					name.draw.call(self, item)
				});
			}

		}
	}

	addEvent(window, "beforeunload", function () {
		for (var padName in trackCache) {
			ls.setItem(padName, JSON.stringify(trackCache[padName]));
		}
	});
}());