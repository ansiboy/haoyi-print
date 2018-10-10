namespace jueying.forms {
    export interface Addon {
        /** 文档模板组件，在加载文档后显示在组件面板中 */
        components: ComponentDefine[],
        /** 工具栏按钮，在加载文档后显示在组件面板中 */
        renderToolbarButtons?: (context: { activeDocument: PageDocumentFile }) => JSX.Element[]
    }

}