import { BrowserWindow } from "electron";
import * as path from 'path'

export function createSettingsWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 500,
        title: '设置',
        show: false,
        frame: false,
        transparent: true,
    })

    let indexFilePath = path.join(__dirname, '../content/index.html')
    win.loadURL(indexFilePath + '#settings')

    return win
}