
namespace jueying {

    export interface EditorProps extends React.Props<ControlEditor> {
    }

    export interface EditorState {
        editors: { text: string, editor: React.ReactElement<any> }[]
    }

    export class ControlEditor extends React.Component<EditorProps, EditorState>{

        private _element: HTMLElement | null = null;

        constructor(props: EditorProps) {
            super(props);

            this.state = { editors: [] }
        }

        setControls(controls: Control<any, any>[]) {
            let flatProps: { [navName: string]: { value: any, control: Control<any, any> } } = {}
            for (let i = 0; i < controls.length; i++) {
                let control = controls[i]

                let controlProps: { [key: string]: any } = Object.assign({}, control.props);
                delete (controlProps as any).children;
                controlProps = this.flatProps(controlProps) 

                if (i == 0) {
                    flatProps = controlProps
                }
                else {
                    for (let key in flatProps) {
                        if (controlProps[key] == undefined) {
                            delete flatProps[key]
                        } else if (controlProps[key] != flatProps[key]) {
                            flatProps[key] = null
                        }
                    }
                }
            }

            let editorInfos: { [navName: string]: PropEditorInfo } = {}
            for (let navName in flatProps) {
                let firstPropEditorInfo: PropEditorInfo
                for (let i = 0; i < controls.length; i++) {
                    let control = controls[i]
                    let className = control.constructor.name
                    let propNames = navName.split('.')
                    let propEditorInfo = ControlPropEditors.getControlPropEditorByArray(className, propNames)
                    if (propEditorInfo == null)
                        break

                    if (i == 0) {
                        firstPropEditorInfo = propEditorInfo
                        continue
                    }

                    if (!this.isSameEditor(firstPropEditorInfo, propEditorInfo)) {
                        firstPropEditorInfo = null
                        break
                    }
                }

                if (firstPropEditorInfo) {
                    editorInfos[navName] = firstPropEditorInfo
                }
            }

            let editors: { text: string, editor: React.ReactElement<any> }[] = []
            for (let navName in editorInfos) {
                let editorInfo = editorInfos[navName]
                let editorType = editorInfo.editorType

                let editor: React.ReactElement<any> = React.createElement(editorType, {
                    value: flatProps[navName],
                    onChange: (value) => {
                        for (let i = 0; i < controls.length; i++) {
                            let c = controls[i]
                            c.designer.updateControlProps(c.id, navName.split('.'), value)
                        }
                    }
                })
                editors.push({ text: editorInfo.text, editor })
            }

            this.setState({ editors })
        }

        private setPropsValue(obj: object, propNames: string[], value: any) {
            console.assert(propNames.length > 0)
            for (let i = 0; i < propNames.length - 1; i++) {
                obj = obj[propNames[i]] = obj[propNames[i]] || {}
            }

            obj[propNames[propNames.length - 1]] = value
        }
        private getPropsValue(obj: object, propNames: string[]) {
            console.assert(propNames.length > 0)
            for (let i = 0; i < propNames.length; i++) {
                obj = obj[propNames[i]]
            }

            return obj
        }

        private flatProps(props: object, baseName?: string): { [key: string]: object } {
            baseName = baseName ? baseName + '.' : ''
            let obj = {}
            for (let key in props) {
                if (typeof props[key] != 'object') {
                    obj[baseName + key] = props[key]
                }
                else {
                    Object.assign(obj, this.flatProps(props[key], key))
                }
            }

            return obj
        }

        private isSameEditor(editorInfo1: PropEditorInfo, editorInfo2: PropEditorInfo) {
            if (editorInfo1.text != editorInfo2.text)
                return false

            let propName1 = editorInfo1.propNames.join('.')
            let propName2 = editorInfo2.propNames.join('.')
            if (propName1 != propName2)
                return false

            return editorInfo1.editorType.name == editorInfo2.editorType.name
        }

        render() {
            let editors = this.state.editors
            if (editors.length == 0) {
                return this.Element(<div>EMPTY</div>)
            }

            return this.Element(<React.Fragment>
                {editors.map((o, i) =>
                    <div key={i} className="form-group">
                        <label>{o.text}</label>
                        <div className="control">
                            {o.editor}
                        </div>
                    </div>
                )}
            </React.Fragment>)
        }

        get element() {
            return this._element;
        }

        Element(...children: React.ReactElement<any>[]) {
            return React.createElement('div', {
                ref: (e) => {
                    this._element = e || this._element
                }
            }, ...children);
        }
    }
}