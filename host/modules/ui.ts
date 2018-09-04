import { mainWindow } from "..";

export function maxMainWindow() {
    if (mainWindow.isMaximized())
        mainWindow.unmaximize()
    else
        mainWindow.maximize()
}

export function minMainWindow() {
    mainWindow.minimize()
}