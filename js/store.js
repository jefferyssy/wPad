
var store = {
    undoList: [],
    redoList: [],
    itemObj: {},
    save: function (canvas) {
        if (this.undoList.length === 0 || (this.undoList[this.undoList.length - 1]['data'] != canvas.toDataURL())) {
            this.itemObj['show'] = true;
            this.itemObj['data'] = canvas.toDataURL();
            this.undoList.push(this.itemObj);
            this.itemObj = {};
        }
    },
    undo: function (ctx, self) {
        this.changeStatus(ctx, self);
    },
    redo: function (ctx) {
        this.redoStatus(ctx);
    },
    init: function (ctx, self) {
        var mainCanvas = self.getMainCanvas();
        var len = this.undoList.length;
        if (len) {
            var imgSrc = '';
            this.undoList.reverse();
            for(var i = 0;i<len;i++){
                if(this.undoList[i]['show'] === true && imgSrc === ''){
                    imgSrc = this.undoList[i]['data'];
                    break;
                }
            }
            if (imgSrc === '') {
                imgSrc = this.undoList[this.undoList.length - 1].data;
            }
            var img = document.createElement('img');
             this.undoList.reverse();
            img.setAttribute('src', imgSrc);
            img.onload = function () {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
            }
        }
    },
    changeStatus: function (ctx, e) {
        var self = this;
        var mainCanvas = e.getMainCanvas();
        if (self.undoList.length) {
            //处理数据
            var imgSrc = self.handleData();

            var img = document.createElement('img');
            img.setAttribute('src', imgSrc);
            img.onload = function () {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
            }
        }

    },
    handleData: function () {
        var imgSrc = '', picArr = this.undoList;
        picArr.reverse();//翻转数组
        for (var i = 0; i < picArr.length; i++) {
            if (picArr[i]['show'] === true) {
                picArr[i]['show'] = false;
                break;
            }
        };
        picArr.map(function (item, index) {
            if(item['show'] === true && imgSrc === ''){
                imgSrc = item['data'];
            }
        });
        if(imgSrc === ''){
            imgSrc = picArr[0]['data'];
        };
        picArr.reverse();
        return imgSrc;
    },
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
