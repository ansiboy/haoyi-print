namespace jueying {

    export interface PropEditorInfo {
        propNames: string[],
        editorType: PropEditorConstructor, group: string
    }

    export class Component {
        private static defaultComponentAttribute: ComponentAttribute = {
            container: false, movable: true, showHandler: false
        }

        private static componentAttributes: { [key: string]: ComponentAttribute } = {
            'table': { container: false, movable: true, showHandler: true, resize: true },
            'thead': { container: false, movable: false },
            'tbody': { container: false, movable: false },
            'tfoot': { container: false, movable: false },
            'tr': { container: false, movable: false },
            'td': { container: true, movable: false },

            'img': { container: false, movable: true, resize: true },

            'div': { container: true, movable: true, showHandler: true, resize: true },
        }

        /**
         * 设置组件特性
         * @param typename 组件类型名称
         * @param attr 组件特性
         */
        static setAttribute(typename: string, attr: ComponentAttribute) {
            Component.componentAttributes[typename] = attr
        }

        /**
         * 获取组件特性
         * @param typename 组件类型名称
         */
        static getAttribute(typename: string) {
            let attr = Component.componentAttributes[typename]
            return Object.assign({}, Component.defaultComponentAttribute, attr || {})
        }

        private static controlPropEditors: {
            [controlClassName: string]: PropEditorInfo[]
        } = {}

        static getPropEditors(controlClassName: string): PropEditorInfo[] {
            let classEditors = this.controlPropEditors[controlClassName] || []
            return classEditors
        }

        static getPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClassName: string, propName: K, propName1: K1): PropEditorInfo
        static getPropEditor<T, K extends keyof T>(controlClassName: string, propName: string): PropEditorInfo
        static getPropEditor(controlClassName: string, ...propNames: string[]): PropEditorInfo {
            return this.getPropEditorByArray(controlClassName, propNames)
        }

        /** 通过属性数组获取属性的编辑器 */
        static getPropEditorByArray(controlClassName: string, propNames: string[]) {
            let classEditors = this.controlPropEditors[controlClassName] || []
            let editor = classEditors.filter(o => o.propNames.join('.') == propNames.join('.'))[0]
            return editor
        }

        static setPropEditor(componentType: React.ComponentClass | string, propName: string, editorType: PropEditorConstructor, group?: string, ): void {
            group = group || ''
            let propNames = (propName as string).split('.')

            let className = typeof componentType == 'string' ? componentType : componentType.prototype.typename || componentType.name
            let classProps = Component.controlPropEditors[className] = Component.controlPropEditors[className] || []
            for (let i = 0; i < classProps.length; i++) {
                let propName1 = classProps[i].propNames.join('.')
                let propName2 = propNames.join('.')
                if (propName1 == propName2) {
                    classProps[i].editorType = editorType
                    return
                }
            }
            classProps.push({ propNames: propNames, editorType, group })
        }
    }
}