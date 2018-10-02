namespace jueying {

    export interface PropEditorInfo {
        propNames: string[],
        editorType: PropEditorConstructor, group: string
    }

    /** 组件属性编辑器，为组件的属性提供可视化的编辑器 */
    export class ComponentPropEditor {
        private static controlPropEditors: {
            [controlClassName: string]: PropEditorInfo[]
        } = {}

        static getControlPropEditors(controlClassName: string): PropEditorInfo[] {
            let classEditors = this.controlPropEditors[controlClassName] || []
            return classEditors
        }

        static getControlPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClassName: string, propName: K, propName1: K1): PropEditorInfo
        static getControlPropEditor<T, K extends keyof T>(controlClassName: string, propName: string): PropEditorInfo
        static getControlPropEditor(controlClassName: string, ...propNames: string[]): PropEditorInfo {
            return this.getControlPropEditorByArray(controlClassName, propNames)
        }

        /** 通过属性数组获取属性的编辑器 */
        static getControlPropEditorByArray(controlClassName: string, propNames: string[]) {
            let classEditors = this.controlPropEditors[controlClassName] || []
            let editor = classEditors.filter(o => o.propNames.join('.') == propNames.join('.'))[0]
            return editor
        }

        static setControlPropEditor(componentType: React.ComponentClass | string, propName: string, editorType: PropEditorConstructor, group?: string, ): void {
            group = group || ''
            let propNames = (propName as string).split('.')

            let className = typeof componentType == 'string' ? componentType : componentType.prototype.typename || componentType.name
            let classProps = ComponentPropEditor.controlPropEditors[className] = ComponentPropEditor.controlPropEditors[className] || []
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