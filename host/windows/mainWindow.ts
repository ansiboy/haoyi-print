import { BrowserWindow } from "electron"
import * as path from 'path'

export function createMainWindow() {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 1024, height: 800,
        webPreferences: { nativeWindowOpen: true },
        frame: false,
        show: false,
    })

    // and load the index.html of the app.
    let indexFilePath = path.join(__dirname, '../../www/index.html')
    mainWindow.loadURL(indexFilePath + '#main')

    // Open the DevTools.
    mainWindow.webContents.openDevTools()
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