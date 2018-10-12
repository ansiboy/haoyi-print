/// <reference path="../../node_modules/electron/electron.d.ts"/>
/// <reference path="../../node_modules/@types/node/index.d.ts"/>
/// <reference path="../../www/lib/jueying.d.ts"/>
/// <reference path="../../www/lib/ui.d.ts"/>
/// <reference path="../../www/lib/typings/chitu.d.ts"/>
/// <reference path="../../www/lib/typings/qrcode.d.ts"/>


// D:\projects\haoyi-print\node_modules\@types\node\index.d.ts

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
	export interface ControlPlaceholderProps {
		showField?: boolean,
		field?: string,
	}
}

declare function h(type, props, ...children);



declare let nodeRequire: NodeRequire


// declare namespace requirejs {

// 	function nodeRequire(moduleName: 'fs'): typeof fs
// }

declare interface HTMLWebViewElement {
	openDevTools()
	loadURL(url: string)
}

declare namespace jueying {
	interface ComponentProps<T> {
		text?: string,
		field?: string,
		// expression?: string,
	}
}



// import * as fs from 'fs'
// interface NodeRequireFunction {
// 	(moduleName: 'fs'): typeof fs;
// }