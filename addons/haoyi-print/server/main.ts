

import { webServer } from './webServer';
import { readConfig } from './config';
import { createTray } from './ui/tray';
import { app } from 'electron'
import { createSettingsWindow } from './ui/settings-window';
export default function main() {
    readConfig().then(config => {
        webServer.listen(config.userConfig.port, config.userConfig.hostname)
    })

    var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {

    });


    if (shouldQuit) {
        app.quit();
    }
    else {
        start()
    }
}

function start() {
    let settingsWindow = createSettingsWindow()
    createTray(settingsWindow, {
        '设置': function () {
            settingsWindow.show()
        },
        '退出': function () {
            app.quit()
        }
    })
}