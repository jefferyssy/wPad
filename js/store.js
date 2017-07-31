
var store = {
    undoList: [],
    redoList: [],
    itemObj:{},
    save: function (canvas) {
        if(this.undoList.length === 0 || (this.undoList[this.undoList.length - 1]['data'] != canvas.toDataURL())){
            this.itemObj['show'] = true;
            this.itemObj['data'] = canvas.toDataURL();
            this.undoList.push(this.itemObj);
            this.itemObj = {};
        }
    },
    undo: function (ctx,self) {
        this.changeStatus(ctx,self);
    },
    redo: function (ctx) {
        this.redoStatus(ctx);
    },
    init:function(ctx,self){
        var mainCanvas = self.getMainCanvas();
        if(this.undoList.length){
            var imgSrc = '';
            this.undoList.map(function(item,index){
                if(item['show'] == false && imgSrc === ''){
                    imgSrc = item['data'];
                }
            });
            if(imgSrc === ''){
                imgSrc = this.undoList[this.undoList.length - 1].data;
            }
            var img = document.createElement('img');
            img.setAttribute('src', imgSrc);
            img.onload = function () {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
            }
        }
    },
    changeStatus: function (ctx,self) {
        var mainCanvas = self.getMainCanvas();
        if (this.undoList.length) {
            var imgSrc = '';
            this.undoList[this.undoList.length - 1]['show'] = false;
            this.undoList.reverse().map(function(item,index){
                if(item['show'] == true && imgSrc === ''){
                    imgSrc = item['data'];
                    item['show'] = false;
                }
            });
            if(imgSrc === ''){
                imgSrc = this.undoList[this.undoList.length - 1]['data'];
            }
            var img = document.createElement('img');
            img.setAttribute('src', imgSrc);
            this.undoList.reverse();
            img.onload = function () {
                ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
                ctx.drawImage(img, 0, 0, mainCanvas.width, mainCanvas.height, 0, 0, mainCanvas.width, mainCanvas.height);
            }
        }

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
