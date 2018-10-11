"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
let button = document.createElement('button');
document.body.appendChild(button);
button.innerHTML = "Click ME";
button.onclick = function () {
    var win = new electron_1.remote.BrowserWindow({ width: 400, show: false });
    win.loadFile('print.html');
    setTimeout(() => {
        win.webContents.print({
            silent: true,
            deviceName: 'Gprinter 2120TL(标签)',
            // deviceName: 'Microsoft XPS Document Writer',
            printBackground: true,
        }, function (success) {
            if (!success) {
                alert('print fail');
            }
        });
        setTimeout(() => {
            win.close();
        }, 1000);
    }, 1000);
    // win.show();
    // win.webContents.print();
};
