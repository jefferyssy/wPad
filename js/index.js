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
;(function() {
	var vm = window.vm || {},
		toString = Object.prototype.toString,
		imgNode = document.createElement("IMG"),
		ss = sessionStorage,
		defaultConfig = {
			name: "pad",
			wrap: document.body,
			layout: 1,
			toolbars: ["line", "arrow", "pen", "circle", "ellipes", "circlestroke", "ellipesstroke", "rect", "rectstroke", "eraser", "floodFill", "eyeDropper", "text", "scissors", "import", "export", "clear", "undo", "color", "save"],
			done: function() {}
		},
		titles = {line:"直线", arrow:"箭头", pen:"画笔", circle:"实心圆", ellipes:"实心椭圆", circlestroke:"空心圆", ellipesstroke:"空心椭圆", rect:"实心矩形", rectstroke:"空心矩形", eraser:"橡皮擦", floodFill:"填充", eyeDropper:"取色工具", text:"文本", scissors:"截图", import:"插入图片", export:"导出", clear:"清除", undo:"撤销", color:"颜色", save:"保存"};

	vm.module = vm.module || {};
	window.vm = vm;
	var tpl = "	<div class='wPad-wrap wPad-layout$NUMBER$'>\
					<ul class='toolbar-wrap'>$TOOLBARS$</ul>\
					<div class='canvas-wrap'>\
						<canvas class='can buffer-can' width='$MAINCANVASWIDTH$' height='$MAIINCANVASHEIGHT$'></canvas>\
						<canvas class='can main-can' width='$MAINCANVASWIDTH$' height='$MAIINCANVASHEIGHT$'>浏览器版本太低，暂不支持此功能，请更新！</canvas>\
					</div>\
				</div>";

	var toolbarTpl = "<li class='toolbar-item-wrap'><i item='$ITEM$' class='iconfont icon-$CLASS$' title='$TITLE$'></i></li>";

	var addEvent = window.addEventListener?function(target, type, fn, use) {
		if(!target || !type || !fn) return ;
		target.addEventListener(type, fn, use||false);
	}:function(target, type, fn) {
		if(!target || !type || !fn) return ;
		target.attachEvent("on"+type, fn);
	};

	function WPad(params) {
		if(!this instanceof WPad) return new WPad(params);
		this.name = params.name;
		var self = this, _module = {};
		this.getParams = function() { return params; };
		this.getModule = function(name) {return !name ? _module : _module[name];};
		buildPad.call(this, function(name, m) {_module[name] = m;});
	}

	WPad.prototype = {
		constructor: WPad,
		draw: function(data) {
			var tool = this.getModule(data.item.toLowerCase());
			// var tool = this.getModule(data.item);
			tool && tool.draw.call(this, data);
		},
		clear: function() {
			var getMainCanvas = this.getMainCanvas();
			getMainCanvas.width = getMainCanvas.width;
		}
	};

	window.wPad = {
		init: function(_params) {
			if(!_params) return ;
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

		var i = 0, len = toolbars.length, count = 0;
		if(len>i) {
			do {
				var toolbar = toolbars[i];

				if(toolbar && vm.module[toolbar]) {
					new vm.module[toolbar](function(m) {
						str+=toolbarTpl.replace(/\$ITEM\$|\$CLASS\$/g, toolbar).replace(/\$TITLE\$/g, titles[toolbar]||"");
						fn.call(self, toolbar, m);
						count++;
						count>=len && "[object Function]"===toString.call(params.done) && params.done.call(self);
					});
				}
			} while(++i<len)
		}

		var padStr = tpl.replace(/\$TOOLBARS\$/g, str).replace(/\$NUMBER\$/g, layout)
						.replace(/\$MAINCANVASWIDTH\$/g, wrap.clientWidth)
						.replace(/\$MAIINCANVASHEIGHT\$/g, wrap.clientHeight);
		wrap.innerHTML = padStr;
		
		var toolbar = wrap.getElementsByClassName("toolbar-wrap")[0],
			mainCanvas = wrap.getElementsByClassName("main-can")[0],
			bufferCanvas = wrap.getElementsByClassName("buffer-can")[0];

		addEvent(mainCanvas, "mousedown", function() {
			self.item.mousedown && self.item.mousedown.apply(self, [].slice.call(arguments, 0));
		});

		addEvent(mainCanvas, "mousemove", function() {
			var e = arguments[0] || window.event;
			1===e.which && self.item.mousemove && self.item.mousemove.apply(self, [].slice.call(arguments, 0));
		});

		addEvent(mainCanvas, "mouseup", function() {
			self.item.mouseup && self.item.mouseup.apply(self, [].slice.call(arguments, 0));
		});

		addEvent(toolbar, "click", function() {
			var e = arguments[0] || window.event,
				item = e.srcElement.getAttribute("item") || e.target.getAttribute("item");

			if(item) {
				var tool = self.getModule()[item];

				if(tool) {
					var name = tool.name || "";
					if(!name) return ;

					switch(name.toLowerCase()) {
					case "clear":
						self.clear();
						params.clear.call(self);
						break;
					case "export":
						tool.export.call(self);
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

		self.getMainCanvas = function(){
			return mainCanvas;
		};

		self.getBufferCanvas = function() {
			return bufferCanvas;
		};

		var tool = self.getModule()[item];
		if(tool) {
			self.item = tool;
			mainCanvas.setAttribute("item", tool.name);
		}
	}

	function copy(copyData, receiveData) {
		if("[object Array]"===toString.call(copyData)) {
			var i = 0, len = copyData.length;
			if(len>i) {
				do {
					var d = copyData[i];

					if("[object Array]"===toString.call(d) || "[object Object]"===toString.call(d)) {
						var data = "[object Array]"===toString.call(d)?[]:{};
						copy(d, data);
						receiveData.push(data);
					} else {
						receiveData.push(d);
					}
				} while(++i<len)
			}
		} else /*("[object Object]"===toString.call(copyData))*/ {
			for(var key in copyData) {
				var d = copyData[key];

				if("[object Array]"===toString.call(d) || "[object Object]"===toString.call(d)) {
					var data = "[object Array]"===toString.call(d)?[]:{};
					copy(d, data);
					receiveData[key] = data;
				} else {
					receiveData[key] = d;
				}
			}
		}
	}
}(void(0)));