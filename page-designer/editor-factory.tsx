namespace jueying {

    export class ControlEditorFactory {
        private static controlEditorTypes: { [key: string]: React.ComponentClass<any> | string } = {}
        static register(controlTypeName, editorType: React.ComponentClass<any> | string) {
            this.controlEditorTypes[controlTypeName] = editorType;
        }

        static hasEditor(controlTypeName) {
            return this.controlEditorTypes[controlTypeName] != null;
        }

    }

    export interface PropEditorInfo {
        propNames: string[], text: string, editorType: PropEditorConstructor
    }

    export class ControlPropEditors {
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

        static setControlPropEditor<T, K extends keyof T>(controlClass: React.ComponentClass, text: string, editorType: PropEditorConstructor, propName: K, propName1: keyof T[K]): void
        static setControlPropEditor<T, K extends keyof T>(controlClass: React.ComponentClass, text: string, editorType: PropEditorConstructor, propName: K): void
        static setControlPropEditor(controlClass: React.ComponentClass, text: string, editorType: PropEditorConstructor, ...propNames: string[]): void {

            let className = controlClass.prototype.typename || controlClass.name
            let classProps = this.controlPropEditors[className] = this.controlPropEditors[className] || []
            for (let i = 0; i < classProps.length; i++) {
                let propName1 = classProps[i].propNames.join('.')
                let propName2 = propNames.join('.')
                if (propName1 == propName2) {
                    classProps[i].text = text
                    classProps[i].editorType = editorType
                    return
                }
            }
            classProps.push({ propNames: propNames, text, editorType })
        }

        static getFlatPropValue(obj: Object, flatPropName: string) {

        }
    }


}