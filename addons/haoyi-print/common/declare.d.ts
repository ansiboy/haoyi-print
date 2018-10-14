/// <reference path="../../../node_modules/electron/electron.d.ts"/>
/// <reference path="../../../lib/ui.d.ts"/>
/// <reference path="../../../lib/jueying.d.ts"/>

declare namespace jueying {
	interface ComponentProps<T> {
		text?: string,
		field?: string,
	}
}

interface PrintConfig {
	enableInnerPrintService: boolean
	defaultPrinter: string
	hostname: string,
	port: number
}
declare namespace jueying.forms {
	interface Config {
		print: PrintConfig,
	}
}


declare let nodeRequire: NodeRequire

declare interface HTMLWebViewElement {
	openDevTools()
	loadURL(url: string)
}



