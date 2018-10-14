import * as path from 'path';
import { Menu, Tray, nativeImage, app, MenuItemConstructorOptions, BrowserWindow } from 'electron';

export function createTray(win: BrowserWindow, menus: { [key: string]: Function }) {
    const contextMenu = Menu.buildFromTemplate(Object.getOwnPropertyNames(menus).map(o => ({
        label: o, type: 'normal', icon: nativeImage.createEmpty(),
        click: () => menus[o]()

    }) as MenuItemConstructorOptions))

    let image_path = path.join(__dirname, "../content/image/app_icon.png")
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

