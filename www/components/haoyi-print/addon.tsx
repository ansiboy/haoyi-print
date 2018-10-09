import { PageDocumentFile, Addon } from "jueying.forms";
import React = require("react");
import { showPrintDialog } from "./print";
import { showSettingsDialog } from "../../controls/settingsDialog";

class PrintAddon implements Addon {
    components = [
        {
            componentData: {
                type: 'Label',
                props: {
                    style: {
                        position: 'absolute'
                    } as React.CSSProperties
                },
            },
            displayName: "标签",
            icon: "glyphicon glyphicon-comment",
            introduce: "标签",
        },
        {
            componentData: { type: 'SquareCode' },
            displayName: "二维码",
            icon: "glyphicon glyphicon-qrcode",
            introduce: "二维码",
        },
        {
            componentData: {
                type: 'List',
                props: { style: { width: 300 } },
                children: [
                    { type: 'ListHeader', props: { style: { height: 40 } } },
                    { type: 'ListBody', props: { style: { height: 40 } } },
                    { type: 'ListFooter', props: { style: { height: 40 } } }
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
    renderToolbarButtons({ activeDocument }: { activeDocument: PageDocumentFile }) {
        let buttonClassName = 'btn btn-default btn-sm'
        let buttons = new Array<JSX.Element>()

        buttons.push(
            <button className={buttonClassName}
                disabled={!activeDocument}
                onClick={() => this.print(activeDocument)}>
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
        return buttons
    }
    print(activeDocument: PageDocumentFile) {
        // let { activeDocument } = this.state
        console.assert(activeDocument != null)

        let doc = activeDocument
        let name = doc.fileName

        showPrintDialog(name)
    }
    exit() {
        const { remote } = nodeRequire('electron')
        remote.app.exit();
    }
    settings() {
        showSettingsDialog()
    }
}

function createPrintButton() {
    return {
        text: '打印',
        icon: 'icon-print',
        disabled: true,
        onClick() {

        }
    }
}

let addon = new PrintAddon()
export default addon