
/// <reference path="../../tray/declare.d.ts"/>

import React = require("react");
import { Service } from "../service";


interface State {
    printers: string[],
    config?: PrintConfig
}

interface Props {
    title?: string,
    close: () => void
    config: PrintConfig
}


export class SettingsView extends React.Component<Props, State>{
    element: HTMLElement;

    constructor(props) {
        super(props)
        this.state = { printers: [], config: this.props.config }
    }
    hide() {
        this.props.close()
    }
    save() {
        // let { writeConfig } = nodeRequire('./../../tray/config')
        // return writeConfig(this.state.config)
        let service = new Service()
        return service.saveConfig(this.state.config)
    }
    async componentDidMount() {
        try {
            let service = new Service()
            let printers = await service.printers()
            this.setState({ printers })
        }
        catch (exc) {
            console.error(exc)
        }
    }
    render() {
        let { printers, config } = this.state
        config = config || {} as any
        let enableInnerPrintService = config.userConfig.enableInnerPrintService || false
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
                                <select className="form-control" value={config.userConfig.defaultPrinter || ''}
                                    onChange={e => {
                                        config.userConfig.defaultPrinter = e.target.value
                                        this.setState({ config })
                                    }}>
                                    <option value="">请选择打印机</option>
                                    {printers.map(o =>
                                        <option key={o} value={o}>{o}</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label className="col-sm-3 control-lable text-right">绑定 IP</label>
                            <div className="col-sm-9">
                                <input className="form-control" value={config.userConfig.hostname || ''}
                                    disabled={!enableInnerPrintService}
                                    onChange={e => {
                                        config.userConfig.hostname = e.target.value
                                        this.setState({ config })
                                    }} />
                            </div>
                        </div>
                        <div className="form-group clearfix">
                            <label className="col-sm-3 control-lable text-right">端口</label>
                            <div className="col-sm-9">
                                <input className="form-control" value={config.userConfig.port || ''}
                                    disabled={!enableInnerPrintService}
                                    onChange={e => {
                                        let value = Number.parseInt(e.target.value)
                                        config.userConfig.port = isNaN(value) ? config.userConfig.port : value
                                        this.setState({ config })
                                    }} />
                                <div className="checkbox">
                                    <label>
                                        <input type="checkbox" checked={enableInnerPrintService}
                                            onChange={e => {
                                                config.userConfig.enableInnerPrintService = e.target.checked
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
