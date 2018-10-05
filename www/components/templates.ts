import { guid } from "jueying";
export default [
    {
        pageData: {
            type: 'PageView',
            props: {
                id: guid(),
                className: "page-view",
                style: {
                    width: '100%', height: '100%', minWidth: 'unset', position: 'absolute'
                },
            } as any
        },
        name: '空白模板(绝对定位)',
        
    }
]