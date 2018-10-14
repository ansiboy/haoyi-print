

import { webServer } from './webServer';
import { readConfig } from './config';
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

    readConfig().then(config => {
        webServer.listen(config.userConfig.port, config.userConfig.hostname)
    })
}

function createSettingsWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 500,
        title: '设置',
        show: true,
        frame: true,
        transparent: false,
        webPreferences: { webSecurity: false },
    })

    win.webContents.openDevTools();

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

