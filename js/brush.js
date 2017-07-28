/**
*
*
* 橡皮擦
* @Author Jason
* @Date 2017-5-11
*
*
*/
; (function () {
    function Brush(fn) {
        if (!this instanceof Brush) return new Brush(fn);
        this.name = "Brush";
        fn.call(Object.create(null), this);
    }

    Brush.prototype = {
        constructor: Brush,
        mousedown: function () {
            var e = arguments[0] || window.event,
                params = this.getParams(),
                bufferCanvas = this.getBufferCanvas(),
                rect = bufferCanvas.getBoundingClientRect(),
                color = document.querySelector('#panColor').value,
                _width = document.querySelector('#brushWidth').value;
            rect.top = rect.top + window.scrollY;
            rect.left = rect.left + window.scrollX;
            var x = e.clientX - rect.left, y = e.clientY - rect.top;
            params.draw.call(this, { item: this.item.name, color: color,brushWidth:_width, pointType: "begin", data: [x, y], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
            this.item.startX = x;
            this.item.startY = y;
        },
        mousemove: function () {
            var e = arguments[0] || window.event,
                params = this.getParams(),
                bufferCanvas = this.getBufferCanvas(),
                rect = bufferCanvas.getBoundingClientRect(),
                x = e.clientX - rect.left,
                y = e.clientY - rect.top,
                color = document.querySelector('#panColor').value,
                _width = document.querySelector('#brushWidth').value;
            this.draw({ item: this.item.name, color: color, brushWidth:_width,pointType: "join", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
            params.draw.call(this, { item: this.item.name, color: color, brushWidth:_width,pointType: "join", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
        },
        mouseup: function () {
            var e = arguments[0] || window.event,
                params = this.getParams(),
                bufferCanvas = this.getBufferCanvas(),
                rect = bufferCanvas.getBoundingClientRect();
            rect.top = rect.top + window.scrollY;
            rect.left = rect.left + window.scrollX,
                color = document.querySelector('#panColor').value,
                _width = document.querySelector('#brushWidth').value;
            var x = e.clientX - rect.left, y = e.clientY - rect.top;
            this.draw({ item: this.item.name, color: color, brushWidth:_width,pointType: "end", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
            params.draw.call(this, { item: this.item.name, color: color, brushWidth:_width,pointType: "end", data: [[this.item.startX, this.item.startY], [x, y]], width: bufferCanvas.width, height: bufferCanvas.height, time: Date.now() });
        },
        draw: function (data) {
            var pointType = data.pointType,
                mainCanvas = this.getMainCanvas(),
                bufferCanvas = this.getBufferCanvas(),
                mainCtx = mainCanvas.getContext("2d"),
                bufferCtx = bufferCanvas.getContext("2d"),
                xs = mainCanvas.width / data.width,
                ys = mainCanvas.height / data.height,
                _data = data.data,
                start_X = _data[0][0],
                start_Y = _data[0][1],
                end_X = _data[1][0],
                end_Y = _data[1][1],
                color = data.color,
                width = data.brushWidth;

            // bufferCanvas.width = bufferCanvas.width;
            switch (pointType) {
                case "begin":
                    break;
                case "join":
                    mainCtx.restore();
                    mainCtx.beginPath();
                    mainCtx.fillStyle = color;
                    mainCtx.arc(end_X, end_Y, width, 0, Math.PI * 2, true);
                    mainCtx.closePath();
                    mainCtx.fill();
                    break;
                default:
                    store.save(mainCanvas)
            }
        }
    };

    window.vm = window.vm || {};
    window.vm.module = window.vm.module || {};
    window.vm.module["brush"] = Brush;
}(void (0)));