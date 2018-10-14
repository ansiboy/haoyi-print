import { BrowserWindow } from "electron";
import * as path from 'path'
import * as fs from 'fs'
// import { configPath } from "../config";

export function createSettingsWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 500,
        title: '设置',
        show: false,
        frame: false,
        transparent: true,
    })


    // let cf = configPath()
    // if (!fs.existsSync(cf)) {
    //     win.show()
    // }

    let indexFilePath = path.join(__dirname, '../content/index.html')
    win.loadURL(indexFilePath + '#settings')

    return win
}