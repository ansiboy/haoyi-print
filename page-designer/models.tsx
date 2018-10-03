namespace jueying {
    export interface Document {
        name?: string,
        createDateTime?: Date,
        version?: number,
        /**
         * 页面的类型，默认为 page
         * snapshoot 为页面快照
         * productTemplate 为商品模板
         * page 为普通页面
         * system 为系统页面
         */
        type?: 'snapshoot' | 'productTemplate' | 'page' | 'system',
        data: ComponentData
    }

    export interface ComponentData {
        type: string;
        props?: ComponentProps<any>;
        children?: ComponentData[],
    }

    export interface ComponentDefine {
        componentData: ComponentData,
        displayName: string, icon: string, introduce: string,
    }
}