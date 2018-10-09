import { guid } from "jueying";
import { PageDocument } from "jueying.forms";

// namespace jueying.forms {

//     type ElementData = jueying.ComponentData;

//     export interface DocumentData {
//         pageData: ElementData,
//         name: string,
//     }



// let template0: DocumentData = {
//     pageData: {
//         type: 'PageView',
//         props: {
//             id: guid(),
//             className: "page-view",
//             style,
//             componentName: "PageView"
//         },
//         children: [
//             {
//                 type: "ControlPlaceholder",
//                 props: {
//                     "emptyText": "页面中部，可以从工具栏拖拉控件到这里",
//                     id: guid(),
//                     htmlTag: 'section',
//                     style: { height: '100%', margin: 0 }
//                 } as any,
//                 children: [
//                     {
//                         type: 'TextHeader',
//                         props: {
//                             id: guid(),
//                             text: '商品订购',
//                             size: 3,
//                         },
//                     },
//                     {
//                         type: 'ValueInput',
//                         props: {
//                             id: guid(),
//                             dataField: '商品名称'
//                         }
//                     },
//                     {
//                         type: 'ValueInput',
//                         props: {
//                             id: guid(),
//                             dataField: '商品数量'
//                         }
//                     },
//                     {
//                         type: 'ValueInput',
//                         props: {
//                             id: guid(),
//                             dataField: '收件人'
//                         }
//                     },
//                     {
//                         type: 'ValueInput',
//                         props: {
//                             id: guid(),
//                             dataField: '联系电话'
//                         }
//                     },
//                     {
//                         type: 'ValueInput',
//                         props: {
//                             id: guid(),
//                             dataField: '收件地址'
//                         }
//                     },
//                     {
//                         type: 'SubmitButton',
//                         props: {
//                             id: guid(),
//                             text: '提交订单',
//                             style: {
//                                 width: '100%'
//                             }
//                         }
//                     },
//                 ]
//             }
//         ]
//     },
//     name: '商品订购'
// }

let template1: PageDocument = {
    pageData: {
        type: 'PageView',
        props: {
            "id": guid(),
            "className": "page-view",
            style: {
                width: '100%', height: '100%', minWidth: 'unset'
            },
            "componentName": "PageView"
        },
        "children": [
            {
                type: "ControlPlaceholder",
                props: {
                    "emptyText": "页面中部，可以从工具栏拖拉控件到这里",
                    "key": "181c33a2-e2fd-9d79-ae08-c8a97cfb1f04",
                    "id": "181c33a2-e2fd-9d79-ae08-c8a97cfb1f04",
                    htmlTag: 'section',
                    style: { height: '100%', margin: 0 }
                } as any
            }
        ]
    },
    name: '空白模板(流式定位)'
}

let template2: PageDocument = {
    pageData: {
        type: 'PageView',
        props: {
            id: guid(),
            className: "page-view",
            style: {
                width: '100%', height: '100%', minWidth: 'unset',
                position: 'absolute'
            } as React.CSSProperties,
            componentName: "PageView",
        } as any
        // children: [
        //     {
        //         type: "ControlPlaceholder",
        //         props: {
        //             id: guid(),
        //             emptyText: "页面中部，可以从工具栏拖拉控件到这里",
        //             htmlTag: 'section',
        //             style: { height: '100%', margin: 0 }
        //         } as any
        //     }
        // ]
    },
    name: '空白模板(绝对定位)',
    addonPath: 'components/haoyi-print'
}

export default [template2];
// }