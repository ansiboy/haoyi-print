import "./components/image"
import "./components/label"
import "./components/list"
import "./components/page-view"
import "./components/square-code"

import { PageDocumentFile, DocumentPlugin, DesignerFramework1, PageDocument } from "jueying.forms";
import React = require("react");
import { showPrintDialog } from "./dialogs/print-dialog";
import { ComponentData, ReactFactory, ComponentProps, guid } from "jueying";
import { generatePrintHTML } from "./print";

let components = [
    {
        componentData: {
            type: 'label'
        },
        displayName: "标签",
        icon: "glyphicon glyphicon-comment",
        introduce: "标签",
    },
    {
        componentData: {
            type: 'div'
        },
        displayName: "DIV",
        icon: "glyphicon glyphicon-comment",
        introduce: "DIV",
    },
    {
        componentData: { type: 'SquareCode' },
        displayName: "二维码",
        icon: "glyphicon glyphicon-qrcode",
        introduce: "二维码",
    },
    {
        componentData: {
            type: 'ul',
            props: { style: { width: 300 } },
            children: [
                { type: 'li', props: { style: { height: 40 } } },
                { type: 'li', props: { style: { height: 40 } } },
                { type: 'li', props: { style: { height: 40 } } }
            ]
        },
        displayName: "列表",
        icon: "glyphicon glyphicon-list",
        introduce: "列表",
    },
    {
        componentData: {
            type: 'table',
            props: {
                style: { width: '200px', height: '200px' },
                className: 'table table-bordered'
            },
            children: [
                {
                    type: 'thead',
                    children: [
                        {
                            type: 'tr',
                            children: [
                                {
                                    type: 'th', props: { style: { width: '33%' } }
                                },
                                { type: 'th', props: { style: { width: '33%' } } },
                                { type: 'th', props: { style: { width: '33%' } } }
                            ]
                        }
                    ]
                },
                {
                    type: 'tbody',
                    children: [
                        {
                            type: 'tr',
                            children: [
                                { type: 'td', children: [{ type: 'div', props: { style: { width: '33%' } } }] },
                                { type: 'td' },
                                { type: 'td' }
                            ]
                        },
                        {
                            type: 'tr',
                            children: [
                                { type: 'td' },
                                { type: 'td' },
                                { type: 'td' }
                            ]
                        },
                        {
                            type: 'tr',
                            children: [
                                { type: 'td' },
                                { type: 'td' },
                                { type: 'td' }
                            ]
                        }
                    ]
                },
                { type: 'tfoot' }
            ]
        },
        displayName: "表格",
        icon: "glyphicon glyphicon-th",
        introduce: "表格",
    }
]

class PrintPlugin implements DocumentPlugin {
    components = components
    init(ide: DesignerFramework1) {

        let buttonClassName = 'btn btn-default btn-sm'
        let buttons = new Array<JSX.Element>()

        let activeDocument = ide.state.activeDocument
        buttons.push(
            <button className={buttonClassName}
                ref={e => {
                    if (!e) return
                    e.disabled = !activeDocument
                    e.onclick = () => {
                        if (!ide.state.activeDocument)
                            return

                        this.print(ide.state.activeDocument)
                    }

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
        </ul>

        ide.toolbarPanel.appendToolbar(toolbar)
    }
    // renderToolbarButtons({ activeDocument }: { activeDocument: PageDocumentFile }) {
    //     let buttonClassName = 'btn btn-default btn-sm'
    //     let buttons = new Array<JSX.Element>()

    //     buttons.push(
    //         <button className={buttonClassName}
    //             disabled={!activeDocument}
    //             onClick={() => this.print(activeDocument)}>
    //             <i className="icon-print" />
    //             <span>打印</span>
    //         </button>,
    //     )
    //     buttons.unshift(...[

    //         <button className={`${buttonClassName}`}
    //             onClick={e => this.settings()}>
    //             <i className="icon-cogs" />
    //             <span>设置</span>
    //         </button>,
    //     ])
    //     return buttons
    // }
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
    settings() {
        // showSettingsDialog()
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

        return h(type, props, ...children)
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