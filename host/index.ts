import { app } from 'electron'
import { createMainWindow } from './mainWindow';
import * as path from 'path';
import { readConfig } from './config';
import { webServer } from './web-server';


var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) { });
if (shouldQuit) {
  app.quit();
}
else {
  start()
}

async function start() {
  app.on('ready', async function () {
    let config = await readConfig()
    let indexFilePath = path.join(app.getAppPath(), config.index || '')
    let showMainForm = config.host.showMainForm == null ? true : config.host.showMainForm
    createMainWindow(indexFilePath, showMainForm)
    processConfig(config)
  })
}

function processConfig(config: jueying.forms.Config) {
  let obj = config;

  let host_config = Object.assign({
    host: {
      service_port: 52819,
      socket_port: 29673,
      bind_ip: '127.0.0.1'
    }
  } as jueying.forms.Config, config.host);


  webServer.listen(host_config.service_port, host_config.bind_ip);

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
        mod.default(config)
      }
      catch (exc) {
        console.error(exc)
      }
    })
  });
  //=================================================
}
