namespace jueying.forms {

    type ElementData = jueying.ComponentData;

    /**
     * 页面文档，定义页面文档的数据结构
     */
    export interface PageDocument {
        pageData: ElementData,
        name: string,
        /** 组件文件夹，该文档可用组件的文件夹名称 */
        pluginPath?: string,
    }
}