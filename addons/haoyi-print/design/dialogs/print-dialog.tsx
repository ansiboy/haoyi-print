import React = require("react");
import ReactDOM = require("react-dom");
import { createTemplateElement } from '../print'
import { Service } from "../service";

interface PrintDialogProps {
    templateName: string,
}

interface PrintDialogState {
    templateDataText?: string,
    printers: string[],
    selectedPrinter: string,
}

export class PrintDialog extends React.Component<PrintDialogProps, PrintDialogState>{
    constructor(props: PrintDialogProps) {
        super(props)
        this.state = {
            templateDataText: '',
            printers: [],
            selectedPrinter: '',
        }
    }
    async print() {
        let { templateName } = this.props;
        let { templateDataText } = this.state;
        let templateData: any = {}
        if (templateDataText) {
            try {
                templateData = JSON.parse(templateDataText)
            }
            catch{
            }
        }

        let service = new Service()

        // print(deviceName, templateName, templateData)
        let deviceName = this.state.selectedPrinter
        await service.printByTemplate(templateName, templateData, deviceName)
        ui.hideDialog(printDialogElement)
    }
    parseTemplateText(templateDataText: string) {
        try {
            let templateData = JSON.parse(templateDataText)
            return templateData
        }
        catch{
            return null
        }
    }
    componentDidMount() {
        let service = new Service()

        service.getDefaultPrinter().then(o => {
            this.setState({ selectedPrinter: o })
        })
        service.printers().then(items => {
            this.setState({ printers: items })
        })
    }
    render() {
        let { templateName } = this.props;
        let { templateDataText, printers, selectedPrinter } = this.state
        let templateData = this.parseTemplateText(templateDataText)
        return <div className="modal-dialog modal-lg">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close"
                        onClick={() => ui.hideDialog(printDialogElement)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title">打印</h4>
                </div>
                <div className="modal-body clearfix" style={{ minHeight: 200 }}>
                    <div style={{
                        height: 'calc(100% - 30px)', width: 'calc(100% - 320px)', overflow: 'auto',
                        position: 'absolute', border: 'solid 1px'
                    }}
                        ref={async e => {
                            if (!e) return;
                            let templateElement = await createTemplateElement(templateName, templateData);
                            ReactDOM.render(templateElement, e)
                        }}>

                    </div>
                    <div className="pull-right">
                        <textarea style={{ width: 260, height: '100%', minHeight: 400 }}
                            value={templateDataText}
                            onChange={e => {
                                templateDataText = e.target.value
                                this.setState({ templateDataText })
                            }}></textarea>
                    </div>
                </div>
                <div className="modal-footer">
                    <label className="pull-left" style={{ padding: '4px 8px 0 0' }}>
                        打印机
                    </label>
                    <div className="pull-left" style={{ width: 200 }}>
                        <select className="form-control" value={selectedPrinter}
                            onChange={e => {
                                selectedPrinter = e.target.value
                                this.setState({ selectedPrinter })
                            }}>
                            <option value="">默认打印机</option>
                            {printers.map(o =>
                                <option key={o} value={o}>{o}</option>
                            )}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => this.print()}>
                        <i className="icon icon-ok" />
                        <span>确定</span>
                    </button>
                </div>
            </div>
        </div>
    }
}

var printDialogElement: HTMLElement = document.createElement('div')
printDialogElement.className = 'modal fade'
document.body.appendChild(printDialogElement)

export function showPrintDialog(templateName: string, templateData?: object) {
    ReactDOM.render(<PrintDialog {...{ templateName, templateData }} />, printDialogElement)

    ui.showDialog(printDialogElement)
}





// export async function print({ deviceName, html }: { deviceName: string, html: string }) {

//     if (!html) throw argumentNull('html')

//     deviceName = deviceName || ''

//     let printWindow = new BrowserWindow({
//         width: 500,
//         height: 500,
//         show: false,
//     })
//     let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
//     printWindow.loadURL(file);
//     setTimeout(() => {
//         printWindow.webContents.print({ silent: true, deviceName });
//         //==============================
//         // 发送指令后指令后关闭窗口
//         setTimeout(() => {
//             printWindow.close()
//         }, 2000)
//         //==============================
//     }, 800)
// }


