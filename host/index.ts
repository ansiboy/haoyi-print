
// Modules to control application life and create native browser window
import { app, BrowserWindow } from 'electron'
import { webServer } from './webServer';
import { readConfig } from './config';
import { createTray } from './tray';
import { createMainWindow } from './windows/mainWindow';
import { createSettingsWindow } from './windows/settingsWindow';


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.


//====================================================
export let mainWindow: BrowserWindow
export let settingsWindow: BrowserWindow


var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {

});

if (shouldQuit) {
  app.quit();
}
else {
  start()
}

function start() {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', function () {
    mainWindow = createMainWindow()
    settingsWindow = createSettingsWindow()

    createTray(mainWindow, {
      '显示': function () {
        mainWindow.show()
      },
      '设置': function () {
        settingsWindow.show()
      },
      '退出': function () {
        app.quit()
      }
    })
  })

  /*
  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  */

  app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      mainWindow = createMainWindow()
    }
  })

  readConfig().then(config => {
    webServer.listen(config.userConfig.port, config.userConfig.hostname)

  })

}
