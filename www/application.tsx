import { Application } from "./chitu-react";
import ReactDOM = require("react-dom");
import React = require("react");
import { DesignerFramework, Config } from "jueying.forms";
import templates from "./templates";

class MyApplication extends Application {
}

export let app = new MyApplication()

define('modules/main', function () {
    async function func(page: chitu.Page) {
        let config = await loadConfig();
        ReactDOM.render(<DesignerFramework {...{
            componentDefines: [], templates, title: '好易标签打印',
            config
        }} />, page.element)
    }

    return { default: func }
})

declare type ProjectConfig = jueying.forms.Config & {
    host: {
        service_port: number,
        socket_port: number,
        bind_ip: string,
        showMainForm: boolean,
    }
}

export function loadConfig() {
    return new Promise<ProjectConfig>((resolve, reject) => {
        requirejs(['text!config'],
            function (configText: string) {
                let config: ProjectConfig = JSON.parse(configText)
                resolve(config)
            },
            function (err) {
                reject(err)
            }
        )
    })
}