namespace jueying {

    export class ControlEditorFactory {
        private static controlEditorTypes: { [key: string]: React.ComponentClass<any> | string } = {}
        static register(controlTypeName, editorType: React.ComponentClass<any> | string) {
            this.controlEditorTypes[controlTypeName] = editorType;
        }

        static async create(control: Control<any, any>) {
            if (control == null)
                throw Errors.argumentNull('control');

            let componentName = control.componentName;

            let editorType = this.controlEditorTypes[componentName];
            if (!editorType) {
                throw new Error(`${componentName} editor type is not exists.`)
            }

            if (typeof editorType == 'string') {
                editorType = await new Promise<React.ComponentClass>((resolve, reject) => {
                    let editorPath = editorType as string;
                    requirejs([editorPath],
                        (exports2) => {
                            let editor: React.ComponentClass = exports2['default'];
                            if (editor == null)
                                throw new Error(`Default export of file '${editorPath}' is null.`)

                            resolve(editor);
                        },
                        (err) => reject(err)
                    )
                })
                this.controlEditorTypes[componentName] = editorType;
            }

            let editorProps: EditorProps = { control, key: control.id };
            let editorElement = React.createElement(editorType, editorProps);

            return editorElement;
        }

        static hasEditor(controlTypeName) {
            return this.controlEditorTypes[controlTypeName] != null;
        }

    }

    export class ControlPropEditors {
        private static controlPropEditors: {
            [controlClassName: string]: { [propName: string]: { text: string, editorType: PropEditor<any> } }
        } = {}

        static getControlPropEditor(controlClassName: string) {
            let classEditors = this.controlPropEditors[controlClassName] || {}
            return classEditors
        }

        static setControlPropEditor<T, K extends keyof T>(controlClass: React.ComponentClass, propName: K, text: string, editorType: PropEditor<T[K]>): void {
            let className = controlClass.name
            let classProps = this.controlPropEditors[className] = this.controlPropEditors[className] || {}
            classProps[propName as string] = { text, editorType }
        }
    }


}