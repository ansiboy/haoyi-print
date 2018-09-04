import React = require("react");
import { Dialog } from "./dialog";
import { SettingsView } from "../modules/settings";
import ReactDOM = require("react-dom");

let settingsDialogElement: HTMLElement

export function showSettingsDialog() {
    if (settingsDialogElement == null) {
        let element = document.createElement('div')
        element.className = 'modal fade'
        document.body.appendChild(element)

        ReactDOM.render(<SettingsView close={() => { ui.hideDialog(element) }} />, element,
            () => {
                ui.showDialog(element)
            }
        )
    }

}