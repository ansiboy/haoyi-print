import { ControlFactory, EditorFactory, extentions as ext, extentions } from 'jueying';
import { components, templates } from "components/componenDefines";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import 'components/placeholder'
import { showPrintDialog, generatePrintHTML } from 'print'
import { ControlSize } from 'components/controlSize';
import { Service } from 'service';
import { showSettingsDialog } from '../controls/settingsDialog';
import { ServiceDocumentStorage } from '../designer/serviceDocumentStorage';

class MainPage extends ext.DesignerFramework {
    private _storage1: extentions.DocumentStorage;
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
        let { pageDocuments, activeDocumentIndex } = this.state
        console.assert(pageDocuments != null)
        console.assert(activeDocumentIndex >= 0 && activeDocumentIndex <= pageDocuments.length - 1)

        let doc = pageDocuments[activeDocumentIndex]
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
    createButtons(pageDocument: ext.PageDocument) {
        let buttonClassName = 'btn btn-default btn-sm'
        let buttons = super.createButtons(pageDocument, buttonClassName)
        let { activeDocumentIndex, pageDocuments } = this.state

        activeDocumentIndex = activeDocumentIndex == null ? -1 : activeDocumentIndex;
        pageDocuments = pageDocuments || [];
        buttons.push(
            <button className={buttonClassName}
                disabled={activeDocumentIndex < 0 || activeDocumentIndex > pageDocuments.length - 1}
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
        let setControlPosition = this.pageDesigner.setControlPosition
        this.pageDesigner.setControlPosition = function (controlId: string, left: number | string, top: number | string) {
            left = ControlSize.toDefaultUnitSize(left)
            top = ControlSize.toDefaultUnitSize(top)
            setControlPosition.apply(this, [controlId, left, top])
        }

        let toolbarElement = this.pageDesigner.element.querySelector('.toolbar') as HTMLElement
        if (toolbarElement) {
            this.enableMove(toolbarElement, this.window)
        }
    }
}

components.forEach(o => {
    ControlFactory.register(o.name, o.controlPath);
    EditorFactory.register(o.name, o.editorPath);
})



export default function (page: chitu.Page) {
    ControlFactory.loadAllTypes().then(o => {
        ReactDOM.render(<MainPage {...{
            components, templates, title: '好易标签打印'
        }} />, page.element)
    })
}

const { ipcRenderer } = nodeRequire('electron')
ipcRenderer.on('generate-template-html', async function (event: Electron.Event, args: { templateName: string, templateData: object }) {
    let html = await generatePrintHTML(args.templateName, args.templateData)
    ipcRenderer.send('generate-template-html', html)
})


