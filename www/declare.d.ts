/// <reference path="../node_modules/electron/electron.d.ts"/>
/// <reference path="../lib/typings/require.d.ts"/>
/// <reference path="../lib/typings/chitu.d.ts"/>
/// <reference path="../lib/typings/qrcode.d.ts"/>
/// <reference path="../lib/typings/ui.d.ts"/>
/// <reference path="../lib/jueying.d.ts"/>

declare module 'jueying' {
	export = jueying;
}

declare namespace jueying {
	export interface PageViewProps {
		width?: number,
		// height?: number,
		data?: { [key: string]: any },
		unit: string,
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
