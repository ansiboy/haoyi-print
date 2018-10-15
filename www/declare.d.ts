/// <reference path="../node_modules/electron/electron.d.ts"/>
/// <reference path="../lib/jueying.d.ts"/>
/// <reference path="../lib/typings/require.d.ts"/>
/// <reference path="../lib/typings/chitu.d.ts"/>
/// <reference path="../lib/ui.d.ts"/>

declare module 'jueying' {
    export = jueying;
}
declare module 'jueying.extentions' {
    export = jueying.forms
}
declare module 'jueying.forms' {
    export = jueying.forms
}

declare function h(type, props, ...children);

declare let nodeRequire: NodeRequire

declare interface HTMLWebViewElement {
    openDevTools()
    loadURL(url: string)
}

