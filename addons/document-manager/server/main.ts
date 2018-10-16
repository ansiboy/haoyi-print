/// <reference path="../../../node_modules/@types/node/index.d.ts"/>
/// <reference path="../../../host/declare.d.ts"/>

import { registerController } from '../../../host/web-server'
import path = require('path')
export default function main(config: jueying.forms.Config) {
    console.assert(config != null)
    console.assert(config.host)

    let templatePath = path.join(__dirname, 'modules/document')
    registerController('document', templatePath)
}