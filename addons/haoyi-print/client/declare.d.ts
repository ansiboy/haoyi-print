/// <reference path="../../../node_modules/electron/electron.d.ts"/>
/// <reference path="../../../www/lib/jueying.d.ts"/>
/// <reference path="../../../www/lib/ui.d.ts"/>
/// <reference path="../../../www/lib/typings/chitu.d.ts"/>
/// <reference path="../../../www/lib/typings/qrcode.d.ts"/>

declare module 'jueying' {
	export = jueying;
}
declare module 'jueying.extentions' {
    
	export = jueying.forms
}
declare module 'jueying.forms' {
	export = jueying.forms
}

declare namespace jueying {
	interface ComponentProps<T> {
        text?: string,
        field?: string,
    }
}


declare let nodeRequire: NodeRequire

declare interface HTMLWebViewElement {
	openDevTools()
	loadURL(url: string)
}


