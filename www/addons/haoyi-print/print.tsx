import { ComponentData } from "jueying";
import { DocumentStorage, PageDocument } from "jueying.forms";
import { Service } from "../../service";
import ReactDOM = require("react-dom");

export async function print(deviceName: string, name: string, data?: object) {
    let printHTML = await generatePrintHTML(name, data);

    const { remote } = nodeRequire('electron')
    console.assert(remote != null)

    let printWindow = new remote.BrowserWindow({
        width: 500,
        height: 500,
        show: true,
        webPreferences: {
            webSecurity: false
        }
    })
    let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(printHTML);
    printWindow.loadURL(file);
    setTimeout(() => {
        printWindow.webContents.print({ silent: true, deviceName });
        //==============================
        // 发送指令后指令后关闭窗口
        setTimeout(() => {
            printWindow.close()
        }, 1000 * 60)
        //==============================
    }, 800)
}


export async function generatePrintHTML(templateName: string, data?: object) {

    return new Promise<string>(async (resolve) => {
        let templateElement = await createTemplateElement(templateName, data)

        let element = document.createElement('div')
        ReactDOM.render(templateElement, element)
        const path = nodeRequire('path')
        let bootcssPath = path.join(__dirname, 'lib/bootstrap-3.3.7/bootstrap.css')
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
              
                  .page-view {
                    font-size: 10pt;
                    font-family: 'Microsoft YaHei','Hiragino Sans GB','FangSong_GB2312','Microsoft Sans Serif',Helvetica, Arial,'Lucida Grande','sans-serif';
                  }
                </style>
                <link rel="stylesheet" href="../lib/Font-Awesome-3.2.1/css/font-awesome.css" />
                <link rel="stylesheet" href="${bootcssPath}">
              </head>
              <body>
              ${element.innerHTML}
              </body>
              
              </html>`

            resolve(html)
        });
    })
}

export async function createTemplateElement(templateName: string, data?: object): Promise<React.ReactElement<any>> {
    let storage = new ServiceDocumentStorage()
    let r = await storage.load(templateName);
    if (r == null)
        throw new Error(`Can not get template '${templateName}'`);

    (r.pageData.props as any).data = data;
    let pageData = translateComponentData(r.pageData, data)
    //================================================
    // 移除高度
    delete pageData.props.style.height
    //================================================
    let reactElement = jueying.Component.createElement(pageData)
    if (reactElement == null)
        throw new Error('create element fail')

    return reactElement
}

let service = new Service()
class ServiceDocumentStorage implements DocumentStorage {
    list(pageIndex: number, pageSize: number): Promise<{ items: PageDocument[]; count: number; }> {
        return service.templateList().then(r => {
            return {
                items: r,
                count: r.length
            }
        })
    }
    load(name: string): Promise<PageDocument | null> {
        return service.templateGet(name)
    }
    save(name: string, pageData: PageDocument): Promise<any> {
        return service.templateSave(name, pageData)
    }
    remove(name: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}



/** 将绑定的数据转换成文本 */
function translateComponentData(componentData: ComponentData, data: any): ComponentData {

    componentData = JSON.parse(JSON.stringify(componentData))
    if (data == null)
        return componentData

    console.assert(componentData.props)
    let field = componentData.props.field
    let dataValue: any
    if (field) {
        dataValue = data[field]
        if (!Array.isArray(dataValue)) {
            componentData.props.text = dataValue || ' '
        }
    }

    // 转换子元素
    let children = componentData.children || []
    let newChildren = []
    if (Array.isArray(dataValue)) {
        dataValue.forEach(dataItem => {
            children.forEach(child => {
                let newChild = translateComponentData(child, dataItem)
                newChildren.push(newChild)
            })
        })
    }
    else {
        children.forEach(child => {
            let dataItem = dataValue || data
            let newChild = translateComponentData(child, dataItem)
            newChildren.push(newChild)
        })
    }

    componentData.children = newChildren
    return componentData
}
