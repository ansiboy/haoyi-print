
import { Plugin } from 'jueying.forms'
import React = require('react');
const { remote } = nodeRequire('electron')

class Toolbar extends React.Component<any, any>{
    constructor(props: any) {
        super(props)
    }
    exit(): void {
        remote.app.exit();
    }
    toggleMax(): void {
        let window = remote.getCurrentWindow()
        if (window.isMaximized())
            window.unmaximize()
        else
            window.maximize()
    }
    windowMin() {
        let window = remote.getCurrentWindow()
        window.minimize()
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
        if (super.componentDidMount)
            super.componentDidMount()

        let toolbarElement = document.querySelector('.toolbar') as HTMLElement
        if (toolbarElement) {
            let window = remote.getCurrentWindow()
            this.enableMove(toolbarElement, window)
        }
        toolbarElement.ondblclick = () => {
            this.toggleMax()
        }
    }
    render() {
        let buttonClassName = 'btn btn-default btn-sm'

        return <ul>
            <li className="pull-right">
                <button className={`${buttonClassName}`}
                    onClick={e => this.exit()}>
                    <i className="icon-remove" />
                </button>
            </li>
            <li className="pull-right">
                <button className={`${buttonClassName}`}
                    onClick={e => this.toggleMax()}>
                    <i className="icon-check-empty" />
                </button>
            </li>
            <li className="pull-right">
                <button className={`${buttonClassName}`} onClick={e => this.windowMin()}>
                    <i className="icon-minus" />
                </button>
            </li>
        </ul>
    }
}

let plugin: Plugin = {
    init(ide) {
        ide.toolbarPanel.appendToolbar(<Toolbar key='win-min-max-toolbar' />)
    }
}

export default plugin