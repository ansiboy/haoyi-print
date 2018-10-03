import { DesignerFramework, DocumentStorage, PageDocument } from 'jueying.extentions'
import { components, templates } from "components/componenDefines";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { showPrintDialog, generatePrintHTML } from 'print'
import { showSettingsDialog } from '../controls/settingsDialog';
import { ServiceDocumentStorage } from '../designer/serviceDocumentStorage';
// import '../components/placeholder'
// import '../components/control-placeholder'
import '../components/list'
import '../components/label'
import '../components/htmlTag'
import '../components/squareCode'

class MainPage extends DesignerFramework {
    private _storage1: DocumentStorage;
    constructor(props) {
        super(props)

    }
    get storage() {
        if (this._storage1 == null)
            this._storage1 = new ServiceDocumentStorage()

        return this._storage1
    }
    get window() {
        const { remote } = nodeRequire('electron');
        let win = remote.getCurrentWindow();
        return win
    }
    print() {
        let { activeDocument } = this.state
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
        showSettingsDialog()
    }
    windowMax() {
        if (this.window.isMaximized())
            this.window.unmaximize()
        else
            this.window.maximize()
    }
    windowMin() {
        this.window.minimize()
    }
    createButtons(pageDocument: PageDocument) {
        let buttonClassName = 'btn btn-default btn-sm'
        let buttons = super.createButtons(pageDocument, buttonClassName)
        let { activeDocument, pageDocuments } = this.state

        pageDocuments = pageDocuments || [];
        buttons.push(
            <button className={buttonClassName}
                disabled={!activeDocument}
                onClick={() => this.print()}>
                <i className="icon-print" />
                <span>打印</span>
            </button>,
        )
        buttons.unshift(...[
            <button className={`${buttonClassName}`}
                onClick={e => this.exit()}>
                <i className="icon-remove" />
            </button>,
            <button className={`${buttonClassName}`}
                onClick={e => this.windowMax()}>
                <i className="icon-check-empty" />
            </button>,
            <button className={`${buttonClassName}`} onClick={e => this.windowMin()}>
                <i className="icon-minus" />
            </button>,
            <button className={`${buttonClassName}`}
                onClick={e => this.settings()}>
                <i className="icon-cogs" />
                <span>设置</span>
            </button>,
        ])
        return buttons
    }

    enableMove(titleElement: HTMLElement, win: Electron.BrowserWindow) {
        //============================================================
        // 实现窗口移动
        let x: number, y: number;
        let capture: boolean;
        titleElement.onmousedown = (event) => {
            console.log(`onmousedown ${event.x} ${event.y}`)
            const DrapMini = 200, DrapMax = 720;
            if (event.x > DrapMax && event.x < DrapMini) {
                return;
            }
            capture = true
        }
        window.onmouseup = (event) => {
            capture = false
            x = null
            y = null
        }
        window.onkeydown = (event) => {
            // 按下 CTRL + C 退出
            let F12 = 123;
            if (event.keyCode == F12) {
                win.webContents.openDevTools();
            }
        }

        let deltaX;
        let deltaY;
        window.onmousemove = (event) => {
            if (!capture) {
                return
            }
            if (x != null && y != null) {
                deltaX = event.screenX - x
                deltaY = event.screenY - y

                let pos = win.getPosition()
                let main_win_x = pos[0] + deltaX
                let main_win_y = pos[1] + deltaY
                win.setPosition(main_win_x, main_win_y)
            }

            x = event.screenX
            y = event.screenY
        }
    }
    componentDidMount() {
        super.componentDidMount()
        let toolbarElement = document.querySelector('.toolbar') as HTMLElement
        if (toolbarElement) {
            this.enableMove(toolbarElement, this.window)
        }

        // ControlPropEditors.setControlPropEditor<PageViewProps, "style", "width">(PageView, "宽", controlSize(), "style", "width")
    }
}

// components.forEach(o => {
//     ControlFactory.register(o.name, o.controlPath);
//     EditorFactory.register(o.name, o.editorPath);
// })



export default function (page: chitu.Page) {
    // jueying.core.loadAllTypes().then(o => {
    ReactDOM.render(<MainPage {...{
        components, templates, title: '好易标签打印'
    }} />, page.element)
    // })
}

const { ipcRenderer } = nodeRequire('electron')
ipcRenderer.on('generate-template-html', async function (event: Electron.Event, args: { templateName: string, templateData: object }) {
    let html = await generatePrintHTML(args.templateName, args.templateData)
    ipcRenderer.send('generate-template-html', html)
})


