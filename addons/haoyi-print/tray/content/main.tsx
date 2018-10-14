
import ReactDOM = require("react-dom");
import React = require("react");
import { SettingsView } from "../../design/dialogs/settings-view";

let settingsElement = document.getElementById('settings')

requirejs(['text!./config.json'], function (configText: string) {
    let config = JSON.parse(configText)
    ReactDOM.render(<SettingsView
        config={config}
        close={() => {
            const { remote } = nodeRequire('electron')
            remote.getCurrentWindow().hide()

        }} />, settingsElement)
})