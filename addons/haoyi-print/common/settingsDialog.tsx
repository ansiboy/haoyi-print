/// <reference path="./declare.d.ts"/>

import React = require("react");
import ReactDOM = require("react-dom");
import { SettingsView } from "./settings-view";

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

interface PrintConfig {
    enableInnerPrintService: boolean
    defaultPrinter: string
    hostname: string,
    port: number
}



