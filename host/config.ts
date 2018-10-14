import * as path from 'path'
import fs = require('fs')
import { app } from 'electron';
import * as errors from './errors'

// export type UserConfig = {
//     defaultPrinter?: string,
//     port: number,
//     hostname: string,
//     enableInnerPrintService: boolean,
// }

// export type ApplicationConfig = {
//     productName: string,
//     templatePath: string,
// }

// export type Config = {
//     userConfig: UserConfig,
//     applicationConfig: ApplicationConfig
// }

// const defaultUserConfig: UserConfig = {
//     hostname: '127.0.0.1',
//     port: 52894,
//     enableInnerPrintService: true,
// }

// const defaultApplicationConfig: ApplicationConfig = {
//     templatePath: './print-templates',
//     productName: '好易标签打印',
// }

// const defaultConfig: Config = {
//     userConfig: defaultUserConfig,
//     applicationConfig: defaultApplicationConfig,
// }

type Config = jueying.forms.Config

// const defaultConfig: Config = {
//     index: 'index.html',
//     host: {
//         service_port: 6215
//     }
// }

export function configPath() {
    let filepath = path.join(app.getAppPath(), "project-config.json")
    return filepath;
}

export async function readConfig(): Promise<Config> {
    let filepath = configPath()
    let config: Config
    if (!fs.existsSync(filepath)) {
        throw errors.configNotExists(filepath)
    }

    config = await new Promise<Config>((resolve, reject) => {
        fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) reject(err)

            let config: Config = JSON.parse(data)
            resolve(config)
        })
    })
    // config = Object.assign(defaultConfig, config)
    // }

    return config
}

export async function writeConfig(config: Config) {
    // config = Object.assign({}, defaultUserConfig, config)
    let filepath = configPath()
    fs.writeFileSync(filepath, JSON.stringify(config))
}