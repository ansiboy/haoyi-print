import * as React from "react";
import * as ReactDOM from "react-dom";
import { PageViewProps, ControlFactory, guid } from "jueying";
import { Service } from "./service";
import { ServiceDocumentStorage } from "./designer/serviceDocumentStorage";

var printDialogElement: HTMLElement = document.createElement('div')
printDialogElement.className = 'modal fade'
document.body.appendChild(printDialogElement)


interface PrintDialogProps {
    templateName: string,
    templateData?: object,
}

interface PrintDialogState {
    templateData?: object,
    templateDataText?: string,
}

// export async function defaultPrinterName(): Promise<string>
// export async function defaultPrinterName(value: string): Promise<void>
// export async function defaultPrinterName(value?: string): Promise<string | void> {
//     if (value === undefined)
//         return 'Gprinter  GP-2120TL' //localStorage.getItem('defaultPrinterName')

//     if (value === null) {
//         localStorage.removeItem('defaultPrinterName')
//         return
//     }

//     localStorage.setItem('defaultPrinterName', value)
// }



class PrintDialog extends React.Component<PrintDialogProps, PrintDialogState>{
    constructor(props: PrintDialogProps) {
        super(props)
        this.state = {
            templateData: props.templateData,
            templateDataText: props.templateData ? JSON.stringify(props.templateData) : ''
        }
    }
    async print() {
        let { templateName } = this.props;
        let { templateData } = this.state;

        let service = new Service()
        let deviceName = await service.getDefaultPrinter()
        print(deviceName, templateName, templateData)
    }
    componentWillReceiveProps(props: PrintDialogProps) {
        this.setState({ templateData: props.templateData })
    }
    render() {
        let { templateName } = this.props;
        let { templateData, templateDataText } = this.state
        return <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close"
                        onClick={() => ui.hideDialog(printDialogElement)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title">打印</h4>
                </div>
                <div className="modal-body clearfix" style={{ minHeight: 200 }}>
                    <div style={{ height: '100%' }} ref={async e => {
                        if (!e) return;
                        let templateElement = await createTemplateElement(templateName, templateData);
                        ReactDOM.render(templateElement, e)
                    }}>

                    </div>
                    <div className="pull-right">
                        <textarea style={{ width: 260, height: '100%', minHeight: 200 }}
                            value={templateDataText}
                            onChange={e => {
                                templateDataText = e.target.value
                                try {
                                    templateData = JSON.parse(templateDataText);
                                }
                                catch {

                                }
                                this.setState({ templateData, templateDataText })
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

export function showPrintDialog(templateName: string, templateData?: object) {
    ReactDOM.render(<PrintDialog {...{ templateName, templateData }} />, printDialogElement)

    ui.showDialog(printDialogElement)
}

export async function print(deviceName: string, name: string, data?: object) {

    // let win_name = 'print-window-' + guid()
    let printHTML = await generatePrintHTML(name, data);

    let service = new Service()
    service.print(deviceName, printHTML)
}

async function createTemplateElement(templateName: string, data?: object): Promise<React.ReactElement<any>> {
    let storage = new ServiceDocumentStorage()
    let r = await storage.load(templateName);
    if (r == null)
        throw new Error(`Can not get template '${templateName}'`);


    (r.props as PageViewProps).data = data;
    let reactElement = ControlFactory.create(r)
    if (reactElement == null)
        throw new Error('create element fail')

    return reactElement
}

export async function generatePrintHTML(templateName: string, data?: object) {

    return new Promise<string>(async (resolve) => {
        let templateElement = await createTemplateElement(templateName, data)

        let element = document.createElement('div')
        ReactDOM.render(templateElement, element)

        setTimeout(() => {
            let html = `
            <!DOCTYPE html>
              <html>
              
              <head>
                <meta charset="UTF-8">
                <title></title>
                <style>
                  @page {
                    margin: 0;
                    padding: 0px;
                  }
              
                  @media print {
                    .page-view section {
                      border: none
                    }
                  }
            
                  .page-view {
                    font-size: 10pt;
                    font-family: 'Microsoft YaHei', 'FangSong_GB2312', 'Hiragino Sans GB',Helvetica,Arial,'Lucida Grande',sans-serif;
                  }
                </style>
                <link rel="stylesheet" href="../lib/Font-Awesome-3.2.1/css/font-awesome.css" />
                <link rel="stylesheet" href="../lib/bootstrap-3.3.7/bootstrap.css">
              </head>
              <body>
              ${element.innerHTML}
              </body>
              
              </html>`

            resolve(html)
        });
    })
}

