import * as path from 'path'
import fs = require('fs')
import { app } from 'electron';
import * as errors from './errors'

type Config = jueying.forms.Config

export function configPath() {
    let filepath = path.join(app.getAppPath(), "config.json")
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

    return config
}

export async function writeConfig(config: Config) {
    // config = Object.assign({}, defaultUserConfig, config)
    let filepath = configPath()
    fs.writeFileSync(filepath, JSON.stringify(config))
}