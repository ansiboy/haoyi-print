namespace jueying {
    /**
     * 实现 JSON 对象的 UNDO，REDO 操作
     */
    export class JSONUndoRedo<T> {
        private undoStack: Array<jsondiffpatch.Delta>
        private redonStack: Array<jsondiffpatch.Delta>
        private _currentData: T
        constructor(initData: T) {
            this._currentData = JSON.parse(JSON.stringify(initData))
            this.undoStack = []
            this.redonStack = []
        }
        get canUndo() {
            return this.undoStack.length > 0
        }
        get canRedo() {
            return this.redonStack.length > 0
        }
        get currentData() {
            return this._currentData
        }
        setChangedData(changedData: ComponentData) {
            if (this.redonStack.length > 0)
                this.redonStack = []

            let delta = jsondiffpatch.diff(this._currentData, changedData)
            if (delta == null)
                return

            this.pushDelta(delta, this.undoStack)
            this._currentData = JSON.parse(JSON.stringify(changedData))
        }
        undo(): T {
            if (this.canUndo == false)
                return

            let delta = this.undoStack.pop()
            this._currentData = jsondiffpatch.unpatch(this._currentData, delta)
            this.pushDelta(delta, this.redonStack)
            return JSON.parse(JSON.stringify(this._currentData))
        }
        redo(): T {
            if (this.canRedo == false)
                return

            let delta = this.redonStack.pop()
            this._currentData = jsondiffpatch.patch(this._currentData, delta)
            this.pushDelta(delta, this.undoStack)

            return JSON.parse(JSON.stringify(this._currentData))
        }

        private pushDelta(delta: jsondiffpatch.Delta, stack: Array<jsondiffpatch.Delta>) {
            //============================================================
            // 对于 delta ，必须 clone 一份数据再 push
            stack.push(JSON.parse(JSON.stringify(delta)))
            //============================================================
        }
    }
}