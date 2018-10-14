let components = [
    {
        componentData: {
            type: 'label'
        },
        displayName: "标签",
        icon: "glyphicon glyphicon-tag",
        introduce: "标签",
    },
    {
        componentData: {
            type: 'div'
        },
        displayName: "DIV",
        icon: "glyphicon glyphicon-book",
        introduce: "DIV",
    },
    {
        componentData: { type: 'SquareCode' },
        displayName: "二维码",
        icon: "glyphicon glyphicon-qrcode",
        introduce: "二维码",
    },
    {
        componentData: {
            type: 'ul',
            props: { style: { width: 300 } },
            children: [
                { type: 'li', props: { style: { height: 40 } } },
                { type: 'li', props: { style: { height: 40 } } },
                { type: 'li', props: { style: { height: 40 } } }
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
                style: { width: '200px', height: '200px' },
                className: 'table table-bordered'
            },
            children: [
                {
                    type: 'thead',
                    children: [
                        {
                            type: 'tr',
                            children: [
                                {
                                    type: 'th', props: { style: { width: '33%' } }
                                },
                                { type: 'th', props: { style: { width: '33%' } } },
                                { type: 'th', props: { style: { width: '33%' } } }
                            ]
                        }
                    ]
                },
                {
                    type: 'tbody',
                    children: [
                        {
                            type: 'tr',
                            children: [
                                { type: 'td', children: [{ type: 'div', props: { style: { width: '33%' } } }] },
                                { type: 'td' },
                                { type: 'td' }
                            ]
                        },
                        {
                            type: 'tr',
                            children: [
                                { type: 'td' },
                                { type: 'td' },
                                { type: 'td' }
                            ]
                        },
                        {
                            type: 'tr',
                            children: [
                                { type: 'td' },
                                { type: 'td' },
                                { type: 'td' }
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
]

export default components