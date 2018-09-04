import * as path from 'path'
import fs = require('fs')
import { app } from 'electron';


export type UserConfig = {
    defaultPrinter?: string,
    port: number,
    hostname: string,
    enableInnerPrintService: boolean,
}

export type ApplicationConfig = {
    productName: string,
    templatePath: string,
}

export type Config = {
    userConfig: UserConfig,
    applicationConfig: ApplicationConfig
}

const defaultUserConfig: UserConfig = {
    hostname: '127.0.0.1',
    port: 52894,
    enableInnerPrintService: true,
}

const defaultApplicationConfig: ApplicationConfig = {
    templatePath: './print-templates',
    productName: '好易标签打印',
}


export function configPath() {
    let filepath = path.join(app.getAppPath(), "config.json")
    return filepath;
}

export async function readConfig(): Promise<Config> {
    let filepath = configPath()
    if (!fs.existsSync(filepath)) {
        let config: Config = {
            userConfig: defaultUserConfig,
            applicationConfig: defaultApplicationConfig
        }
        writeConfig(config)
        return config;
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
    config = Object.assign({}, defaultUserConfig, config)
    let filepath = configPath()
    fs.writeFileSync(filepath, JSON.stringify(config))
}