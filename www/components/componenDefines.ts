/// <reference path="../declare.d.ts" />

import { ComponentDefine, guid } from "jueying";

let componentsDirectory = 'components';
let SquareCode = 'SquareCode'
let Label = 'Label'
let List = 'List'
export let components: Array<ComponentDefine> = [
    {
        name: `${Label}`,
        controlPath: `${componentsDirectory}/${Label}/control`,
        // editorPath: `${componentsDirectory}/${Label}/editor`,

        displayName: "标签",
        icon: "icon-text-width",
        introduce: "标签",
    },
    {
        name: `${SquareCode}`,
        controlPath: `${componentsDirectory}/${SquareCode}/control`,
        // editorPath: `${componentsDirectory}/${SquareCode}/editor`,

        displayName: "二维码",
        icon: "icon-barcode",
        introduce: "二维码",
    },
    {
        name: `${List}`,
        controlPath: `${componentsDirectory}/${List}`,
        // editorPath: `${componentsDirectory}/${SquareCode}/editor`,

        displayName: "列表",
        icon: "icon-barcode",
        introduce: "列表",
    },
    {
        name: `HTMLTag`,
        controlPath: `${componentsDirectory}/htmlTag`,
        // editorPath: `${componentsDirectory}/${SquareCode}/editor`,

        displayName: "HTML 标签",
        icon: "icon-barcode",
        introduce: "HTML 标签",
    },
];

let style = { width: '100%', height: '100%', minWidth: 'unset' };

let template1: jueying.extentions.DocumentData = {
    pageData: {
        type: 'PageView',
        props: {
            id: guid(),
            className: "page-view",
            style,
            componentName: "PageView"
        },
        children: [
            {
                type: "ControlPlaceholder",
                props: {
                    emptyText: "页面中部，可以从工具栏拖拉控件到这里",
                    id: guid(),
                    htmlTag: 'section',
                    style: { height: '100%', margin: 0 }
                } as any
            }
        ]
    },
    name: '空白模板(流式定位)'
}

let template2: jueying.extentions.DocumentData = {
    pageData: {
        type: 'PageView',
        props: {
            id: guid(),
            className: "page-view",
            style,
            componentName: "PageView",
            layout: 'absolute'
        } as any,
        children: [
            {
                type: "div",
                props: {
                    id: guid(),
                    // emptyText: "页面中部，可以从工具栏拖拉控件到这里",
                    // htmlTag: 'section',
                    style: { height: '100%', margin: 0 }
                } as any
            }
        ]
    },
    name: '空白模板(绝对定位)'
}

export let templates = [template2,];

