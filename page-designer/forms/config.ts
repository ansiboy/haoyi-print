namespace jueying.forms {

    export let defaultPluginSingleton = true
    export interface Config {
        index: string,
        plugins: {
            /** 插件 ID */
            id: string,
            /** 插件名称 */
            name: string,
            /** 插件加载文件路径 */
            path: string,
            /** 主界面启动后，是否主动加载该插件 */
            autoLoad?: boolean,
            /** 是否单例，默认为 true */
            singleton?: boolean,
        }[],
        startup: string[]
    }
}