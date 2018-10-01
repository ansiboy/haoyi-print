/// <reference path="../declare.d.ts" />

import { ComponentDefine, guid } from "jueying";

let componentsDirectory = 'components';
let SquareCode = 'SquareCode'
let Label = 'Label'
let List = 'List'
export let components: Array<ComponentDefine> = [
    {
        componentData: {
            type: 'Label',
            props: {
                style: {
                    position: 'absolute'
                }
            }
        },
        controlPath: `${componentsDirectory}/label`,
        displayName: "标签",
        icon: "icon-text-width",
        introduce: "标签",
    },
    {
        componentData: { type: 'SquareCode' },
        controlPath: `${componentsDirectory}/squareCode`,
        displayName: "二维码",
        icon: "icon-barcode",
        introduce: "二维码",
    },
    {
        componentData: {
            type: 'List',
            children: [
                { type: 'ListHeader' },
                { type: 'ListBody' },
                { type: 'ListFooter' }
            ]
        },
        controlPath: `${componentsDirectory}/list`,
        displayName: "列表",
        icon: "icon-barcode",
        introduce: "列表",
    },
    {
        componentData: { type: 'HTMLTag' },
        controlPath: `${componentsDirectory}/htmlTag`,
        displayName: "HTML 标签",
        icon: "icon-barcode",
        introduce: "HTML 标签",
    },
    {
        componentData: {
            type: 'table',
            props: {
                style: { width: '200px', height: '200px', border: 'solid 1px black' }
            },
            children: [
                { type: 'thead' },
                {
                    type: 'tbody',
                    children: [
                        {
                            type: 'tr',
                            children: [
                                { type: 'td', props: { style: { width: '33%' } } },
                                { type: 'td', props: { style: { width: '33%' } } },
                                { type: 'td', props: { style: { width: '33%' } } }
                            ]
                        }
                    ]
                },
                { type: 'tfoot' }
            ]
        },
        controlPath: `${componentsDirectory}/htmlTag`,
        displayName: "表格",
        icon: "icon-barcode",
        introduce: "表格",
    },
    {
        componentData: {
            type: 'div',
            props: {
                style: {
                    width: '200px',
                    height: '200px',
                    border: 'solid 1px black',
                    position: 'absolute'
                }
            }
        },
        controlPath: `${componentsDirectory}/htmlTag`,
        displayName: "DIV",
        icon: "icon-barcode",
        introduce: "DIV",
    }
];



let style: React.CSSProperties = { width: '100%', height: '100%', minWidth: 'unset', position: 'absolute' };

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
        } as any
    },
    name: '空白模板(绝对定位)'
}

export let templates = [template2,];

