
import ReactDOM = require("react-dom");
import React = require("react");
import { SettingsView } from "../../design/dialogs/settings-view";
import { Service } from "../../design/service";

let settingsElement = document.getElementById('settings')

// requirejs(['text!config'], function (configText: string) {
let service = new Service()
service.getConfig().then(config => {
    ReactDOM.render(<SettingsView
        config={config}
        close={() => {
            const { remote } = nodeRequire('electron')
            remote.getCurrentWindow().hide()

        }} />, settingsElement)
})
// let config: PrintConfig = JSON.parse(configText)


// })