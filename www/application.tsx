import { Application } from "./chitu-react";

class MyApplication extends Application {
    showSettingsWindow() {
        const { remote } = nodeRequire('electron')
        // remote.BrowserWindow.getAllWindows().filter(o=>o.)
    }
}

export let app = new MyApplication()