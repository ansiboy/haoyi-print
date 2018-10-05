import { ComponentDefine, guid } from "jueying";
export let componentDefines: Array<ComponentDefine> = [
    {
        componentData: {
            type: 'Label',
            props: {
                style: {
                    position: 'absolute'
                }
            }
        },
        displayName: "标签",
        icon: "glyphicon glyphicon-comment",
        introduce: "标签",
    },
    {
        componentData: { type: 'SquareCode' },
        displayName: "二维码",
        icon: "glyphicon glyphicon-qrcode",
        introduce: "二维码",
    },
    {
        componentData: {
            type: 'List',
            props: { style: { width: 300 } },
            children: [
                { type: 'ListHeader', props: { style: { height: 40 } } },
                { type: 'ListBody', props: { style: { height: 40 } } },
                { type: 'ListFooter', props: { style: { height: 40 } } }
            ]
        },
        displayName: "列表",
        icon: "glyphicon glyphicon-list",
        introduce: "列表",
    },
    {
        componentData: {
            type: 'table',
            props: {
                style: { width: '200px', height: '200px', border: 'solid 1px black' },
                className: 'table table-bordered'
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
                        },
                        {
                            type: 'tr',
                            children: [
                                { type: 'td', props: { style: { width: '33%' } } },
                                { type: 'td', props: { style: { width: '33%' } } },
                                { type: 'td', props: { style: { width: '33%' } } }
                            ]
                        },
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
        displayName: "表格",
        icon: "glyphicon glyphicon-th",
        introduce: "表格",
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

