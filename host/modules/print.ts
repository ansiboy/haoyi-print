import { argumentNull } from "../errors";
import { BrowserWindow, ipcMain } from "electron";
import { mainWindow } from "..";
import { readConfig, writeConfig } from "../config";

export async function print({ deviceName, html }: { deviceName: string, html: string }) {

    if (!deviceName) throw argumentNull('deviceName')
    if (!html) throw argumentNull('html')

    let printWindow = new BrowserWindow({
        width: 800,
        height: 500,
        show: false,
    })
    let file = 'data:text/html;charset=UTF-8,' + encodeURIComponent(html);
    printWindow.loadURL(file);
    setTimeout(() => {
        printWindow.webContents.print({ silent: true, deviceName })
        //==============================
        // 发送指令后指令后关闭窗口
        setTimeout(() => {
            printWindow.close()
        }, 1000)
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
    writeConfig(config)
}

export async function printByTemplate({ templateName, templateData }: { templateName: string, templateData: object }) {
    if (!templateName) throw argumentNull('templateName')
    if (!templateData) throw argumentNull('templateData')

    mainWindow.webContents.send('generate-template-html', { templateName, templateData })
}

ipcMain.on('generate-template-html', async (event: Event, html: string) => {
    let deviceName = await getDefaultPrinter() || ''
    print({ deviceName, html })
})

export async function printers() {
    let names = BrowserWindow.getAllWindows()[0].webContents.getPrinters().map(o => o.name)
    return names
}

