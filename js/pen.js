/**
 *
 *
 * 铅笔
 * @Author Jason
 * @Date 2017-5-11
 *
 *
 */

//*****************************************************
//*****************************************************
//*****************************************************
//*****************************************************
//*****************************************************
; (function () {
    function Pen(fn) {
        if (!this instanceof Pen) return new Pen(fn);
        this.name = "Pen";
        fn && fn.call(Object.create(null), this);
    }

    Pen.prototype = {
        constructor: Pen,
        mousedown: function () {
            var e = arguments[0] || window.event,
                params = this.getParams(),
                mainCanvas = this.getMainCanvas(),
                ctx = mainCanvas.getContext("2d"),
                rect = mainCanvas.getBoundingClientRect(),
                color = document.querySelector('#panColor').value;

            rect.top = rect.top + window.scrollY;
            rect.left = rect.left + window.scrollX;
            var x = e.clientX - rect.left, y = e.clientY - rect.top;
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y);
            params.draw.call(this, { item: this.item.name, color:color, pointType: "begin", data: [x, y], width: mainCanvas.width, height: mainCanvas.height, time: Date.now() });
        },
        mousemove: function () {
            var e = arguments[0] || window.event,
                params = this.getParams(),
                mainCanvas = this.getMainCanvas(),
                ctx = mainCanvas.getContext("2d"),
                rect = mainCanvas.getBoundingClientRect(),
                color = document.querySelector('#panColor').value;

            rect.top = rect.top + window.scrollY;
            rect.left = rect.left + window.scrollX;
            var x = e.clientX - rect.left, y = e.clientY - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
            params.draw.call(this, { item: this.item.name, color:color, pointType: "join", data: [x, y], width: mainCanvas.width, height: mainCanvas.height, time: Date.now() });
        },
        mouseup: function () {
            var e = arguments[0] || window.event,
                params = this.getParams(),
                mainCanvas = this.getMainCanvas(),
                ctx = mainCanvas.getContext("2d"),
                rect = mainCanvas.getBoundingClientRect(),
                color = document.querySelector('#panColor').value;

            rect.top = rect.top + window.scrollY;
            rect.left = rect.left + window.scrollX;
            var x = e.clientX - rect.left, y = e.clientY - rect.top;
            params.draw.call(this, { item: this.item.name, color:color, pointType: "end", data: [x, y], width: mainCanvas.width, height: mainCanvas.height, time: Date.now() });
            ctx.closePath();
            ctx.save();
            store.save(mainCanvas);
        },
        draw: function (param) {
            var pointType = param.pointType,
                mainCanvas = this.getMainCanvas(),
                bufferCanvas = this.getBufferCanvas(),
                ctx = mainCanvas.getContext("2d"),
                bufferCtx = bufferCanvas.getContext("2d"),
                xs = mainCanvas.width / param.width,
                ys = mainCanvas.height / param.height,
                data = param.data,
                color = param.color;
                
            bufferCanvas.width = bufferCanvas.width;
            switch (pointType) {
                case "begin":
                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;
                	ctx.beginPath();
                    ctx.moveTo((data[0] * xs) >> 0, (data[1] * ys) >> 0);
                    break;
                case "join":
                    ctx.lineTo((data[0] * xs) >> 0, (data[1] * ys) >> 0);
                    ctx.stroke();
                    break;
                default:
                    ctx.closePath();
                    ctx.save();
                    console.log(33333333);
                    store.save(mainCanvas);
            }
        }
    };

    window.vm = window.vm || {};
    window.vm.module = window.vm.module || {};
    window.vm.module["pen"] = Pen;
}(void (0)));