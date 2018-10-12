
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
    windowMax(): void {
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
                    onClick={e => this.windowMax()}>
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