import ReactDOM = require("react-dom");
import React = require("react");
import { SettingsView } from '../../common/settings-view'
let settingsElement = document.getElementById('settings')
ReactDOM.render(<SettingsView close={() => {
    const { remote } = nodeRequire('electron')
    remote.getCurrentWindow().hide()

}} />, settingsElement)
