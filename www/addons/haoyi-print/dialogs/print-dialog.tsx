import React = require("react");
import { Service } from "../../../service";
import ReactDOM = require("react-dom");
import { print, createTemplateElement } from '../print'

interface PrintDialogProps {
    templateName: string,
}

interface PrintDialogState {
    templateDataText?: string,
}

export class PrintDialog extends React.Component<PrintDialogProps, PrintDialogState>{
    constructor(props: PrintDialogProps) {
        super(props)
        this.state = {
            templateDataText: ''
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
        let deviceName = await service.getDefaultPrinter()
        print(deviceName, templateName, templateData)
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
    render() {
        let { templateName } = this.props;
        let { templateDataText } = this.state
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



let service = new Service()


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


