var store = {
    undoList: [],
    redoList: [],
    save: function (canvas) {
        if (this.undoList[this.undoList.length - 1] != canvas.toDataURL()) {
            this.undoList.push(canvas.toDataURL());
        }
        console.log(this.undoList)
    },
    undo: function (ctx) {
        this.changeStatus(ctx);
    },
    redo: function (ctx) {
        this.redoStatus(ctx);
    },
    changeStatus: function (ctx) {
        if (this.undoList.length) {
            var restore_state = this.undoList.pop();
            this.redoList.push(restore_state);
            var img = document.createElement('img');
            img.setAttribute('src', this.undoList[this.undoList.length - 1]);

            img.onload = function () {
                ctx.clearRect(0, 0, 500, 500);
                ctx.drawImage(img, 0, 0, 500, 500, 0, 0, 500, 500);
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
