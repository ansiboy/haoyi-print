import { UserConfig } from "host/config";
import React = require("react");
import ReactDOM = require("react-dom");
import { PageViewProps } from "../chitu-react";
import { Service } from "../service";

interface State {
    printers: Electron.PrinterInfo[],
    config?: UserConfig
}

interface Props extends PageViewProps {
    title?: string,
    close: () => void
}

export default function (page: chitu.Page) {

    let style = document.createElement('style')
    style.innerHTML = `
        body {
            background: 0;
            border: 0;
        }
    `
    document.head.appendChild(style)

    ReactDOM.render(<SettingsView close={() => {
        const { remote } = nodeRequire('electron')
        remote.getCurrentWindow().hide()

    }} />, page.element)
}

export class SettingsView extends React.Component<Props, State>{
    element: HTMLElement;
    config: UserConfig;

    constructor(props) {
        super(props)

        const { remote } = nodeRequire('electron')
        let printers = remote.getCurrentWindow().webContents.getPrinters()
        this.state = { printers }
    }
    hide() {
        this.props.close()
    }
    save() {
        let service = new Service()
        return service.saveConfig(this.state.config)
    }
    async componentDidMount() {
        let service = new Service()
        let c = this.config = await service.getConfig()
        this.setState({ config: c })
    }
    render() {
        let { printers, config } = this.state
        config = config || {} as any
        let enableInnerPrintService = config.enableInnerPrintService || false
        return <div className="modal-dialog" ref={e => this.element = e || this.element}>
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close"
                        onClick={() => this.hide()}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title">设置</h4>
                </div>
                <div className="modal-body clearfix" style={{ minHeight: 200 }}>
                    <form>
                        <div className="form-group clearfix">
                            <label className="col-sm-3 control-lable text-right">默认打印机</label>
                            <div className="col-sm-9">
                                <select className="form-control" value={config.defaultPrinter || ''}
                                    onChange={e => {
                                        config.defaultPrinter = e.target.value
                                        this.setState({ config })
                                    }}>
                                    <option value="">请选择打印机</option>
                                    {printers.map(o =>
                                        <option key={o.name} value={o.name}>{o.name}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label className="col-sm-3 control-lable text-right">绑定 IP</label>
                            <div className="col-sm-9">
                                <input className="form-control" value={config.hostname || ''}
                                    disabled={!enableInnerPrintService}
                                    onChange={e => {
                                        config.hostname = e.target.value
                                        this.setState({ config })
                                    }} />
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label className="col-sm-3 control-lable text-right">端口</label>
                            <div className="col-sm-9">
                                <input className="form-control" value={config.port || ''}
                                    disabled={!enableInnerPrintService}
                                    onChange={e => {
                                        let value = Number.parseInt(e.target.value)
                                        config.port = isNaN(value) ? config.port : value
                                        this.setState({ config })
                                    }} />
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" checked={enableInnerPrintService}
                                            onChange={e => {
                                                config.enableInnerPrintService = e.target.checked
                                                this.setState({ config })
                                            }} />启用内网打印服务
                                    </label>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-primary"
                        onClick={e => ui.buttonOnClick(() => this.save(), { toast: '保存成功' })}
                        ref={e => {
                            if (!e) return
                            ui.buttonOnClick(e, () => this.save(), { toast: '保存成功' })
                        }}>
                        <i className="icon icon-save" />
                        <span>保存</span>
                    </button>
                </div>
            </div>
        </div>
    }
}

