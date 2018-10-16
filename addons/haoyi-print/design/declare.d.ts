/// <reference path="../../../lib/jueying.d.ts"/>
/// <reference path="../../../lib/ui.d.ts"/>
/// <reference path="../../../lib/typings/chitu.d.ts"/>
/// <reference path="../../../lib/typings/qrcode.d.ts"/>
/// <reference path="../../../lib/typings/require.d.ts"/>
/// <reference path="./dialogs/settings-view.tsx"/>

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

// interface PrintConfig {
// 	enableInnerPrintService: boolean
// 	defaultPrinter: string
// 	hostname: string,
// 	port: number
// }
// declare namespace jueying.forms {
// 	interface Config {
// 		print: PrintConfig,
// 	}
// }


declare let nodeRequire: NodeRequire

declare interface HTMLWebViewElement {
	openDevTools()
	loadURL(url: string)
}



