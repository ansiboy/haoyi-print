import templates from "templates";
import * as ReactDOM from 'react-dom';
import * as React from 'react';
// import { showSettingsDialog } from '../controls/settingsDialog';
import { DesignerFramework } from "jueying.forms";

// import config from '../../config'
// requirejs(config.plugins.filter(o => o.load).map(o => o.path), function () {
//     debugger
// })

class MainPage extends DesignerFramework {
    constructor(props) {
        super(props)
    }
    get window() {
        const { remote } = nodeRequire('electron');
        let win = remote.getCurrentWindow();
        return win
    }
    // exit() {
    //     const { remote } = nodeRequire('electron')
    //     remote.app.exit();
    // }
    // settings() {
    //     showSettingsDialog()
    // }
    // windowMax() {
    //     if (this.window.isMaximized())
    //         this.window.unmaximize()
    //     else
    //         this.window.maximize()
    // }
    // windowMin() {
    //     this.window.minimize()
    // }
    // renderButtons(pageDocument: PageDocumentFile) {
    //     let buttonClassName = 'btn btn-default btn-sm'
    //     let buttons = super.renderButtons(pageDocument, buttonClassName)
    //     let { pageDocuments } = this.state

    //     pageDocuments = pageDocuments || [];
    //     buttons.unshift(...[
    //         <button className={`${buttonClassName}`}
    //             onClick={e => this.exit()}>
    //             <i className="icon-remove" />
    //         </button>,
    //         <button className={`${buttonClassName}`}
    //             onClick={e => this.windowMax()}>
    //             <i className="icon-check-empty" />
    //         </button>,
    //         <button className={`${buttonClassName}`} onClick={e => this.windowMin()}>
    //             <i className="icon-minus" />
    //         </button>,
    //     ])
    //     return buttons
    // }

    // enableMove(titleElement: HTMLElement, win: Electron.BrowserWindow) {
    //     //============================================================
    //     // 实现窗口移动
    //     let x: number, y: number;
    //     let capture: boolean;
    //     titleElement.onmousedown = (event) => {
    //         console.log(`onmousedown ${event.x} ${event.y}`)
    //         const DrapMini = 200, DrapMax = 720;
    //         if (event.x > DrapMax && event.x < DrapMini) {
    //             return;
    //         }
    //         capture = true
    //     }
    //     window.onmouseup = (event) => {
    //         capture = false
    //         x = null
    //         y = null
    //     }
    //     window.onkeydown = (event) => {
    //         // 按下 CTRL + C 退出
    //         let F12 = 123;
    //         if (event.keyCode == F12) {
    //             win.webContents.openDevTools();
    //         }
    //     }

    //     let deltaX;
    //     let deltaY;
    //     window.onmousemove = (event) => {
    //         if (!capture) {
    //             return
    //         }
    //         if (x != null && y != null) {
    //             deltaX = event.screenX - x
    //             deltaY = event.screenY - y

    //             let pos = win.getPosition()
    //             let main_win_x = pos[0] + deltaX
    //             let main_win_y = pos[1] + deltaY
    //             win.setPosition(main_win_x, main_win_y)
    //         }

    //         x = event.screenX
    //         y = event.screenY
    //     }
    // }

    // /** 用于显示绑定的字段 */
    // translatePageData(pageData: ComponentData) {
    //     let stack = new Array<ComponentData>()
    //     stack.push(pageData)
    //     while (stack.length > 0) {
    //         let item = stack.pop()
    //         if (item.props.field) {
    //             item.props.text = `[${item.props.field}]`
    //         }
    //         let children = item.children || []
    //         children.forEach(child => {
    //             stack.push(child)
    //         })
    //     }
    // }

    // componentDidMount() {
    //     if (super.componentDidMount)
    //         super.componentDidMount()

    //     let toolbarElement = document.querySelector('.toolbar') as HTMLElement
    //     if (toolbarElement) {
    //         this.enableMove(toolbarElement, this.window)
    //     }
    // }

    render() {
        return super.render()
    }
}




export default function (page: chitu.Page) {

    requirejs(['text!config'], function (configText: string) {
        let config: jueying.forms.Config = JSON.parse(configText)
   

        ReactDOM.render(<MainPage {...{
            componentDefines: [], templates, title: '好易标签打印',
            config
        }} />, page.element)
    })


}



