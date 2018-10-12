

import { webServer } from './webServer';
import { readConfig } from './config';
export default function main() {
    readConfig().then(config => {
        webServer.listen(config.userConfig.port, config.userConfig.hostname)
    })
}