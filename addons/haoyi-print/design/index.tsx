import "./components/image"
import "./components/label"
import "./components/list"
import "./components/page-view"
import "./components/square-code"

import { PageDocument, Plugin, Workbench } from "jueying.forms";
import React = require("react");
import { showPrintDialog } from "./dialogs/print-dialog";
import { ComponentData, ReactFactory, ComponentProps, guid } from "jueying";
import { generatePrintHTML } from "./print";
import components from "./components";
import ReactDOM = require("react-dom");
import { showSettingsDialog } from "./dialogs/settings-dialog";




class PrintPlugin implements Plugin {
    private btn_print: HTMLButtonElement

    init(ide: Workbench) {

        let buttonClassName = 'btn btn-default btn-sm'
        let buttons = new Array<JSX.Element>()

        buttons.push(
            <button className={buttonClassName}
                ref={e => {
                    if (!e) return
                    e.disabled = true
                    e.onclick = () => {
                        if (!ide.activeDocument)
                            return

                        this.print(ide.activeDocument)
                    }
                    this.btn_print = e
                }}>
                <i className="icon-print" />
                <span>打印</span>
            </button>,
        )
        buttons.unshift(...[
            <button className={`${buttonClassName}`}
                onClick={e => this.settings()}>
                <i className="icon-cogs" />
                <span>设置</span>
            </button>,
        ])

        let toolbar = <ul key={guid()}>
            {buttons.map((o, i) =>
                <li key={i} className="pull-right">{o}</li>
            )}
        </ul>;

        return { toolbar }
    }
    onDocumentActived() {
        console.assert(this.btn_print != null)
        this.btn_print.disabled = false
        return { components }
    }
    print(activeDocument: PageDocument) {
        // let { activeDocument } = this.state
        console.assert(activeDocument != null)

        let doc = activeDocument
        let name = doc.name

        showPrintDialog(name)
    }
    exit() {
        const { remote } = nodeRequire('electron')
        remote.app.exit();
    }

    private settingsDialogElement: HTMLElement
    async settings() {
        if (this.settingsDialogElement == null) {
            let element = this.settingsDialogElement = document.createElement('div')
            element.className = 'modal fade'
            document.body.appendChild(element)


            showSettingsDialog()
        }
    }
}

//===================================================================================
// 通过拦截 React.createElement 函数，自定义 HTML 元素生成

function designTimeText(type: string, props: ComponentProps<any>, children: any[]) {
    children = children || []
    let text: string = props.text
    if (text || children.length > 0) {
        return text
    }

    text = props.field ? `[${props.field}]` : props.name

    return text
}

let pageDesignerRender = jueying.PageDesigner.prototype.render
jueying.PageDesigner.prototype.render = function () {

    let reactCreateElement = React.createElement;
    (React as any).createElement = function (type: string, props: ComponentProps<any>, ...children: any[]) {
        if (typeof type == 'string' && props) {

            let text: string = designTimeText(type, props, children)
            delete props.field
            delete props.text

            children = children || []
            if (text) {
                // if (type != 'tbody') {
                children.push(text)
                // }
                // else {
                //     children.unshift(reactCreateElement('tr', {}, reactCreateElement('td', { colSpan: 1000 } as React.CSSProperties, text)))
                // }
            }
        }

        return reactCreateElement(type, props, ...children)
    }
    let result = pageDesignerRender.bind(this)();
    (React as any).createElement = reactCreateElement
    return result
}

let componentCreateElement = jueying.Component.createElement
jueying.Component.createElement = function (args: ComponentData, h?: ReactFactory): React.ReactElement<any> | null {
    let reactCreateElement = React.createElement;
    (React as any).createElement = function (type: string, props: ComponentProps<any>, ...children: any[]) {
        if (typeof type == 'string' && props) {

            let text: string = props.text
            delete props.text

            children = children || []
            if (type != 'tbody' && text) {
                children.push(text)
            }
        }

        return reactCreateElement(type, props, ...children)
    }
    let result = componentCreateElement(args, h);
    (React as any).createElement = reactCreateElement;
    return result
}

//===================================================================================


const { ipcRenderer } = nodeRequire('electron')
ipcRenderer.on('generate-template-html', async function (event: Electron.Event, args: { templateName: string, templateData: object }) {
    let html = await generatePrintHTML(args.templateName, args.templateData)
    ipcRenderer.send('generate-template-html', html)
})

let addon = new PrintPlugin()
export default addon