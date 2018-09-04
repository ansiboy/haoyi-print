import * as path from 'path';
import { Menu, Tray, nativeImage, app, MenuItemConstructorOptions } from 'electron';

export function createTray(win: Electron.BrowserWindow, menus: { [key: string]: Function }) {

    const contextMenu = Menu.buildFromTemplate(Object.getOwnPropertyNames(menus).map(o => ({
        label: o, type: 'normal', icon: nativeImage.createEmpty(),
        click: () => menus[o]()

    }) as MenuItemConstructorOptions))

    let image_path = path.join(__dirname, "content/image/app_icon.png")
    let icon = nativeImage.createFromPath(image_path)
    icon = (icon as any).resize({ width: 16, height: 16 })
    let tray = new Tray(icon)
    tray.setToolTip('打印服务')

    let clicktimes = 0
    tray.on('click', function () {
        clicktimes = clicktimes + 1
        if (clicktimes == 5) {
            win.show()
        }
        // if (win.isVisible()) {
        //     win.hide()
        // } else {
        //     win.show()
        // }
        setTimeout(() => {
            clicktimes = 0
        }, 3000)
    })

    win.on('close', () => tray.destroy())

    if (process.platform == 'darwin') {
        app.dock.setMenu(contextMenu)
        app.dock.setIcon(image_path)
        app.on('activate', function (event, hasVisibleWindows) {
            if (hasVisibleWindows)
                win.hide()
            else
                win.show();
        })
        app.on('continue-activity', function () {
        })
        app.on("browser-window-focus", function () {

        })
        win.on('close', function () {
            app.dock.hide()
        })
    }
    else {
        tray.setContextMenu(contextMenu)
    }
}

