/// <reference path="../www/lib/jueying.d.ts"/>
import { app, BrowserWindow, Config } from 'electron'
import { createTray } from './tray';
import { createMainWindow } from './windows/mainWindow';
import { createSettingsWindow } from './windows/settingsWindow';
import * as path from 'path';
import { readConfig } from './config';
import { webServer } from './webServer';
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

async function start() {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', async function () {
    let config = await readConfig()
    let indexFilePath = path.join(app.getAppPath(), config.index || '')

    mainWindow = createMainWindow(indexFilePath)
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

    processConfig(config)
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

  app.on('activate', async function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    let config = await readConfig()
    let indexFilePath = path.join(app.getAppPath(), config.index || '')
    if (mainWindow === null) {
      mainWindow = createMainWindow(indexFilePath)
    }
  });

  // readConfig().then(config => {
  //   webServer.listen(config.userConfig.port, config.userConfig.hostname)

  // })
}

// let config: jueying.forms.Config
// function loadConfig(): Promise<jueying.forms.Config> {
//   return new Promise((resolve, reject) => {

//     if (config) {
//       return resolve(config)
//     }

//     fs.readFile('project-config.json', (err, data) => {
//       if (err) {
//         console.log(err)
//         reject(err)
//         return
//       }

//       config = JSON.parse(data.toString());
//       resolve(config);


//     })

//   })
// }

function processConfig(config: jueying.forms.Config) {
  let obj = config;

  let host_config = Object.assign({
    host: {
      service_port: 52819,
      service_address: '127.0.0.1'
    }
  } as jueying.forms.Config, config.host);


  webServer.listen(host_config.service_port, host_config.service_address);

  //=================================================
  // 加载插件
  (obj.startup || []).forEach(startup_path => {
    setTimeout(() => {
      try {
        let pathname = path.join(app.getAppPath(), startup_path);
        const mod = require(pathname)
        console.assert(mod != null)
        console.assert(mod.default != null)
        console.assert(typeof mod.default == 'function')
        mod.default()
      }
      catch (exc) {
        console.error(exc)
      }
    })
  });
  //=================================================
}
