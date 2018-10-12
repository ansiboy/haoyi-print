import { BrowserWindow, app } from "electron"
import * as electron from "electron"
import * as path from 'path'
import * as fs from 'fs'

export function createMainWindow(htmlPath: string) {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 1024, height: 800,
        webPreferences: { nativeWindowOpen: true },
        frame: false,
        show: true,
    })

    // and load the index.html of the app.

    mainWindow.loadURL(htmlPath + '#main')
    // Open the DevTools.
    mainWindow.webContents.openDevTools()

    let extes = [
        "C:/Users/maishu/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.4.0_0",
        "C:/Users/ansib/AppData/Local/Google/Chrome/User Data/Default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/3.4.0_0"
    ]

    extes.forEach(path => {
        if (fs.existsSync(path))
            BrowserWindow.addDevToolsExtension(path)
    })
    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null as any
    })

    mainWindow.on('minimize', function () {
        mainWindow.hide()
    })

    mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options: Electron.BrowserWindowConstructorOptions, additionalFeatures) => {
        if (frameName.startsWith('print-window')) {
            event.preventDefault()
            options.show = false;
            options.title = frameName
            let win = new BrowserWindow(options);
            console.log(win.getTitle());
            (event as any).newGuest = win;
        }
    })

    return mainWindow
}