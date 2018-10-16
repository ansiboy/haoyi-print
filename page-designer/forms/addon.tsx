namespace jueying.forms {
    export interface Plugin {
        init?(workbench: Workbench): { toolbar?: JSX.Element },
        onDocumentActived?(args: { document: PageDocument }): { components?: ComponentDefine[] },
        onDocumentChanged?(args: { document: PageDocument }): void
    }

}