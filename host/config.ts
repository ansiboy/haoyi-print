import * as path from 'path'
import fs = require('fs')
import { app } from 'electron';


export type Config = {
    defaultPrinter?: string,
    port: number,
    hostname: string,
    templatePath: string,
    productName: string,
    enableInnerPrintService: boolean,
}

const defaultConfig = {
    hostname: '127.0.0.1',
    port: 52894,
    templatePath: './print-templates',
    productName: '好易标签打印',
    enableInnerPrintService: true,
}


export function configPath() {
    let filepath = path.join(app.getAppPath(), "config.json")
    return filepath;
}

export async function readConfig(): Promise<Config> {
    let filepath = configPath()
    if (!fs.existsSync(filepath)) {
        return defaultConfig
    }

    return new Promise<Config>((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) reject(err)

            let config: Config = JSON.parse(data)
            resolve(config)
        })
    })
}

export async function writeConfig(config: Config) {
    config = Object.assign({}, defaultConfig, config)
    let filepath = configPath()
    fs.writeFileSync(filepath, JSON.stringify(config))
}