import { argumentNull } from "../errors";
import { BrowserWindow } from "electron";
import { readConfig, writeConfig } from "./config";
import { createPrintWindow } from "../main";

export async function print({ deviceName, html }: { deviceName: string, html: string }) {

    if (!html) throw argumentNull('html')

    deviceName = deviceName || ''

    let printWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
    })
    let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
    printWindow.loadURL(file);
    setTimeout(() => {
        printWindow.webContents.print({ silent: true, deviceName });
        //==============================
        // 发送指令后指令后关闭窗口
        setTimeout(() => {
            printWindow.close()
        }, 2000)
        //==============================
    }, 800)
}

export async function getDefaultPrinter(): Promise<string | undefined> {
    let config = await readConfig()
    return config.userConfig.defaultPrinter;
}

export async function setDefaultPrinter({ value }: { value: string }) {
    if (!value) throw argumentNull('value')

    let config = await readConfig()
    config.userConfig.defaultPrinter = value
    writeConfig({ config })
}

type A = { templateName: string, templateData: object, deviceName?: string }
export async function printByTemplate({ templateName, templateData, deviceName }: A) {
    if (!templateName) throw argumentNull('templateName')
    if (!templateData) throw argumentNull('templateData')

    if (!deviceName) {
        deviceName = await getDefaultPrinter() || ''
    }

    let printWindow = createPrintWindow(templateName, templateData)
    printWindow.webContents.on('did-finish-load', () => {
        setTimeout(() => {
            printWindow.webContents.print({ silent: true, deviceName });
            //==============================
            // 发送指令后指令后关闭窗口
            setTimeout(() => {
                // printWindow.close()
            }, 2000)
            //==============================
        }, 800)
    })

}

export async function printers() {
    let names = BrowserWindow.getAllWindows()[0].webContents.getPrinters().map(o => o.name)
    return names
}

