
var store = {
    undoList: [],
    redoList: [],
    itemObj:{},
    save: function (canvas) {
        if(this.undoList.length === 0){
            this.itemObj['show'] = true;
            this.itemObj['data'] = canvas.toDataURL();
            // this.undoList.push(canvas.toDataURL());
            this.undoList.push(this.itemObj);
            this.itemObj = {};
        }else if (this.undoList[this.undoList.length - 1]['data'] != canvas.toDataURL()) {
            this.itemObj['show'] = true;
            this.itemObj['data'] = canvas.toDataURL();
            // this.undoList.push(canvas.toDataURL());
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
    changeStatus: function (ctx,self) {
        var mainCanvas = self.getMainCanvas();
        if (this.undoList.length) {
            // var restore_state = this.undoList.pop();
            // this.redoList.push(restore_state);
            var imgSrc = '';
            this.undoList[this.undoList.length - 1]['show'] = false;
            this.undoList.reverse().map(function(item,index){
                if(item['show'] == true && imgSrc === ''){
                    imgSrc = item['data'];
                    item['show'] = false;
                }
            });
            var img = document.createElement('img');
            // img.setAttribute('src', this.undoList[this.undoList.length - 1]);
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
