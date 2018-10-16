import { BrowserWindow, app } from "electron"
import * as fs from 'fs'

export function createMainWindow(htmlPath: string, show: boolean) {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 1024, height: 800,
        webPreferences: { nativeWindowOpen: true },
        frame: false,
        show,
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
        mainWindow = null as any
    })


    return mainWindow
}