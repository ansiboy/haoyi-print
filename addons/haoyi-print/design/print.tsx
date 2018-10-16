import { ComponentData, Component } from "jueying";
import { Service } from "./service";
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

    printWindow.webContents
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
    let service = new Service()
    let r = await service.documentGet(templateName) //await storage.load(templateName);
    if (r == null)
        throw new Error(`Can not get template '${templateName}'`);

    (r.pageData.props as any).data = data;
    let pageData = JSON.parse(JSON.stringify(r.pageData))
    pageData = data == null ? pageData : translateComponentData(pageData, data)
    //================================================
    // 移除高度
    delete pageData.props.style.height
    //================================================
    let reactElement = jueying.Component.createElement(pageData)
    if (reactElement == null)
        throw new Error('create element fail')

    return reactElement
}



const NULL_TEXT = "";
/** 将绑定的数据转换成文本 */
function translateComponentData(componentData: ComponentData, data: object | Array<any>): ComponentData {

    let field = (componentData.props.field || '').trim()
    if (field) {
        data = data[componentData.props.field]
    }

    if (data == null || typeof data != 'object') {
        componentData.props.text = formatValue(data)
        return componentData
    }

    if (Array.isArray(data)) {
        let newNode: ComponentData = { type: Component.Fragment, children: [] }
        data.forEach(dataItem => {
            let child: ComponentData = JSON.parse(JSON.stringify(componentData))
            delete child.props.field
            child = translateComponentData(child, dataItem)
            newNode.children.push(child)
        })

        return newNode
    }

    // 转换子元素
    let children = componentData.children || []
    let newChildren = children.map(o => translateComponentData(o, data))
    componentData.children = newChildren
    return componentData



    // if (componentData == null)
    //     throw Errors.argumentNull('componentData')

    // if (data == null)
    //     throw Errors.argumentNull('data')

    // if (Array.isArray(data)) {
    //     let newNode: ComponentData = { type: Component.Fragment, children: [] }
    //     data.forEach(dataItem => {
    //         let child = translateComponentData(componentData, dataItem)
    //         newNode.children.push(child)
    //     })

    //     return newNode
    // }

    // console.assert(componentData.props)
    // let field = componentData.props.field
    // let dataValue: any
    // if (field) {
    //     dataValue = data[field]
    //     if (dataValue == null) {
    //         componentData.props.text = NULL_TEXT
    //         return componentData
    //     }
    //     else if (typeof dataValue != 'object') {
    //         componentData.props.text = formatValue(dataValue)
    //         return componentData
    //     }
    //     else if (Array.isArray(dataValue)) {
    //         componentData = translateComponentData(componentData, dataValue)
    //         return componentData
    //     }
    // }

    // // 转换子元素
    // let children = componentData.children || []
    // let newChildren = children.map(o => translateComponentData(o, data))
    // componentData.children = newChildren
    // return componentData
}

//TODO: formatValue
function formatValue(value) {
    return value
}
