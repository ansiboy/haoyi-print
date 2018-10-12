namespace jueying.forms {
    export interface DocumentPlugin extends Plugin {
        /** 文档模板组件，在加载文档后显示在组件面板中 */
        components: ComponentDefine[],
    }

    export interface Plugin {
        init?(form: DesignerFramework1)
    }

}