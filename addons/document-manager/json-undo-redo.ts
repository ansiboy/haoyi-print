import { ComponentData, ComponentProps } from "jueying";
import 'node_modules/jsondiffpatch/dist/jsondiffpatch.umd'
import { Errors } from "./errors";

/**
 * 实现 JSON 对象的 UNDO，REDO 操作
 */
export class JSONUndoRedo {
    private undoStack: Array<jsondiffpatch.Delta>
    private redonStack: Array<jsondiffpatch.Delta>
    private _currentData: ComponentData
    constructor(initData: ComponentData) {
        this._currentData = this.trim(JSON.parse(JSON.stringify(initData)))
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

    /**
     * 对 pageData 进行修剪，去掉不作为保存的字段
     * @param pageData 
     */
    private trim(pageData: ComponentData) {
        const trimFields: (keyof ComponentProps<ComponentData>)[] = ['selected']
        let stack = new Array<ComponentData>()
        stack.push(pageData)
        while (stack.length > 0) {
            let item = stack.pop()
            if (item.props) {
                for (let i = 0; i < trimFields.length; i++)
                    delete item.props[trimFields[i]]
            }

            let children = item.children || []
            for (let i = 0; i < children.length; i++) {
                stack.push(children[i])
            }
        }
        return pageData
    }
    setChangedData(changedData: ComponentData) {
        if (changedData == null)
            throw Errors.argumentNull('changedData')

        if (this.redonStack.length > 0)
            this.redonStack = []

        changedData = JSON.parse(JSON.stringify(changedData))
        this.trim(changedData)

        let delta = jsondiffpatch.diff(this._currentData, changedData)
        if (delta == null)
            return

        this.pushDelta(delta, this.undoStack)
        this._currentData = JSON.parse(JSON.stringify(changedData))
    }
    undo(): ComponentData {
        if (this.canUndo == false)
            return

        let delta = this.undoStack.pop()
        this._currentData = jsondiffpatch.unpatch(this._currentData, delta)
        this.pushDelta(delta, this.redonStack)
        return JSON.parse(JSON.stringify(this._currentData))
    }
    redo(): ComponentData {
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