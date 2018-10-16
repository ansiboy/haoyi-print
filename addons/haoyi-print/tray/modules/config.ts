
import * as path from 'path'
import fs = require('fs')

const defaultConfig: PrintConfig = {
    userConfig: {
        hostname: '127.0.0.1',
        port: 52894,
        enableInnerPrintService: true,
    },
    applicationConfig: {
        productName: '好易标签打印',
    },
}

export function configPath() {

    let filepath = path.join(__dirname, "../config.json")
    return filepath;
}

export async function readConfig(): Promise<PrintConfig> {
    let filepath = configPath()
    let config: PrintConfig
    if (!fs.existsSync(filepath)) {
        config = defaultConfig
        writeConfig({ config })
    }
    else {
        config = await new Promise<PrintConfig>((resolve, reject) => {
            fs.readFile(filepath, 'utf8', (err, data) => {
                if (err) reject(err)

                let config: PrintConfig = JSON.parse(data)
                resolve(config)
            })
        })
        config = Object.assign({}, defaultConfig, config)
    }

    return config
}

export async function writeConfig({ config }: { config: PrintConfig }) {
    config = Object.assign({}, defaultConfig, config)
    let filepath = configPath()
    fs.writeFileSync(filepath, JSON.stringify(config))
}