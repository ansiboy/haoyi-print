

import { registerController } from '../../../host/web-server';
import * as path from 'path';
import { app, BrowserWindow, Menu, nativeImage, MenuItemConstructorOptions, Tray } from 'electron'
export default function main() {

    let settingsWindow = createSettingsWindow()
    createTray(settingsWindow, {
        '设置': function () {
            settingsWindow.show()
        },
        '退出': function () {
            app.quit()
        }
    })


    registerController('print', path.join(__dirname, 'modules/print'))
    registerController('template', path.join(__dirname, 'modules/template'))
    registerController('printConfig', path.join(__dirname, 'modules/config'))

    // let indexFilePath = path.join(__dirname, 'content/index.html#print?templateName=仓库库位.json')

}

function createSettingsWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 500,
        title: '设置',
        show: false,
        frame: false,
        transparent: true,
        webPreferences: { webSecurity: false },
    })

    let indexFilePath = path.join(__dirname, 'content/index.html')
    win.loadURL(indexFilePath)// + '#settings'

    return win
}

function createTray(win: BrowserWindow, menus: { [key: string]: Function }) {
    const contextMenu = Menu.buildFromTemplate(Object.getOwnPropertyNames(menus).map(o => ({
        label: o, type: 'normal', icon: nativeImage.createEmpty(),
        click: () => menus[o]()

    }) as MenuItemConstructorOptions))

    let image_path = path.join(__dirname, "/content/image/app_icon.png")
    let icon = nativeImage.createFromPath(image_path)
    icon = (icon as any).resize({ width: 16, height: 16 })
    let tray = new Tray(icon)
    tray.setToolTip('打印服务')

    let clicktimes = 0
    tray.on('click', function () {
        clicktimes = clicktimes + 1
        win.show()
    })


    tray.setContextMenu(contextMenu)
}

export function createPrintWindow(templateName: string, printData?: object) {
    if (!templateName) throw new Error(`Argument 'templateName' cannt be null or empty`)

    printData = printData || {}
    let printWin = new BrowserWindow({
        width: 800, height: 500, show: false,
        title: '打印',
        webPreferences: { webSecurity: false }
    })
    printWin.webContents.openDevTools()
    let printDataString = encodeURIComponent(JSON.stringify(printData))
    templateName = encodeURIComponent(templateName)
    printWin.loadURL(path.join(__dirname, `content/print.html?templateName=${templateName}&printData=${printDataString}#print`))
    return printWin
}

