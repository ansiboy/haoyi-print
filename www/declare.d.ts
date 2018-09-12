/// <reference path="../node_modules/electron/electron.d.ts"/>

declare module 'jueying' {
	export = jueying;
}
declare module 'jueying.extentions' {
	export = jueying.extentions
}

declare namespace jueying {
	export interface PageViewProps {
		width?: number,
		// height?: number,
		data?: { [key: string]: any },
		unit: string,
		fontFamily?: string,
	}
	export interface ControlPlaceholderProps {
		showField?: boolean,
		field?: string,
	}
}

declare function h(type, props, ...children);

declare let nodeRequire: NodeRequire

declare interface HTMLWebViewElement {
	openDevTools()
	loadURL(url: string)
}
