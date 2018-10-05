import "./image"
import "./label"
import "./list"
import "./page-view"
import "./square-code"
import { ComponentDefine } from "jueying";

export default [
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
] as ComponentDefine[]