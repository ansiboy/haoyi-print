declare namespace vr {
    interface Confid {
        index: string,
        plugins: {
            /** 插件名称 */
            name: string,
            /** 插件加载文件路径 */
            path: string,
            /** 主界面启动后，是否主动加载该插件 */
            load: boolean
        }[],
        startup: string[]
    }
}