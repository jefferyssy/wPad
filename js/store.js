
var store = {
    undoList: [],
    redoList: [],
    itemObj: {},
    /**
     * 保存绘画过程
     * 
     * @param {any} canvas 
     */
    save: function (canvas) {
        if (this.undoList.length === 0 || (this.undoList[this.undoList.length - 1]['data'] != canvas.toDataURL())) {
            this.itemObj['show'] = true;
            this.itemObj['data'] = canvas.toDataURL();
            this.undoList.push(this.itemObj);
            this.itemObj = {};
        }
        var data = this.undoList;
        socket.emit('send', data);
    },
    /**
     * 撤销方法
     * 
     * @param {any} ctx 
     * @param {any} self 
     */
    undo: function (ctx, self) {
        this.changeStatus(ctx, self);
    },
    /**
     * 反撤销方法
     * 
     * @param {any} ctx 
     */
    redo: function (ctx) {
        this.redoStatus(ctx);
    },
    /**
     * 画板初始化渲染
     * 
     * @param {any} ctx 
     * @param {any} self 
     */
    init: function (ctx, self) {
        var mainCanvas = self.getMainCanvas();
        var len = this.undoList.length;
        if (len) {
            var imgSrc = '';
            this.undoList.reverse();
            for (var i = 0; i < len; i++) {
                if (this.undoList[i]['show'] === true && imgSrc === '') {
                    imgSrc = this.undoList[i]['data'];
                    break;
                }
            }
            if (imgSrc !== '') {
                var img = document.createElement('img');
                this.undoList.reverse();
                img.setAttribute('src', imgSrc);
                img.onload = function () {
                    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                    ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
                }
            }else{
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            }

        } else {
            ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        }
    },
    /**
     * 撤销后渲染画板
     * 
     * @param {any} ctx 
     * @param {any} e 
     */
    changeStatus: function (ctx, e) {
        var self = this;
        var mainCanvas = e.getMainCanvas();
        if (self.undoList.length) {
            //处理数据
            var imgSrc = self.handleData();
            //当所有图层都撤销时，清空画板并显示
            if (imgSrc !== '') {
                var img = document.createElement('img');
                img.setAttribute('src', imgSrc);
                img.onload = function () {
                    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                    ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
                }
            } else {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
            }
        };
        socket.emit('send', this.undoList);
    },
    /**
     * 处理撤销数据，返回显示图层
     * 
     * @returns 
     */
    handleData: function () {
        var imgSrc = '', picArr = this.undoList;
        picArr.reverse();//翻转数组
        //撤销当前图层
        for (var i = 0; i < picArr.length; i++) {
            if (picArr[i]['show'] === true) {
                picArr[i]['show'] = false;
                break;
            }
        };
        //遍历获取下一个图层
        picArr.map(function (item, index) {
            if (item['show'] === true && imgSrc === '') {
                imgSrc = item['data'];
            }
        });
        picArr.reverse();
        return imgSrc;
    },
    /**
     * 清空画板
     * 
     */
    clear: function () {
        this.undoList = [];
        socket.emit('send', this.undoList);
    },
    /**
     * 反撤销数据处理
     * 
     * @param {any} ctx 
     */
    redoStatus: function (ctx) {
        if (this.redoList.length) {
            var img = document.createElement('img');
            img.setAttribute('src', this.redoList[this.redoList.length - 1]);

            img.onload = function () {
                ctx.clearRect(0, 0, 500, 500);
                ctx.drawImage(img, 0, 0, 500, 500, 0, 0, 500, 500);
                store.undoList.push(store.redoList.pop());
            }
        }
    }
}
