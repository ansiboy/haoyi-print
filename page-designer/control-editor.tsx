
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
            if (controls.length == 0) {
                this.setState({ editors: [] })
                return
            }

            // 各个控件相同的编辑器
            let commonPropEditorInfos: PropEditorInfo[]

            for (let i = 0; i < controls.length; i++) {
                let control = controls[i]
                let className = control.constructor.name
                let propEditorInfos = ControlPropEditors.getControlPropEditors(className)
                if (i == 0) {
                    commonPropEditorInfos = propEditorInfos || []
                }
                else {
                    let items: PropEditorInfo[] = []
                    commonPropEditorInfos.forEach(propInfo1 => {
                        propEditorInfos.forEach(propInfo2 => {
                            let propName1 = propInfo1.propNames.join('.')
                            let propName2 = propInfo2.propNames.join('.')
                            if (propInfo1.text == propInfo2.text && propInfo1.editorType == propInfo2.editorType && propName1 == propName2) {
                                items.push(propInfo1)
                            }
                        })
                    })
                    commonPropEditorInfos = items
                }
            }

            // 各个控件相同的属性值
            let commonFlatProps: { [navName: string]: any }
            for (let i = 0; i < controls.length; i++) {
                let control = controls[i]
                let controlProps: { [key: string]: any } = Object.assign({}, control.props);
                delete (controlProps as any).children;
                controlProps = this.flatProps(controlProps)
                if (i == 0) {
                    commonFlatProps = controlProps
                }
                else {
                    let obj = {}
                    for (let key in commonFlatProps) {
                        if (commonFlatProps[key] == controlProps[key])
                            obj[key] = controlProps[key]
                    }
                    commonFlatProps = obj
                }
            }

            let editors: { text: string, editor: React.ReactElement<any> }[] = []
            for (let i = 0; i < commonPropEditorInfos.length; i++) {
                let propEditorInfo = commonPropEditorInfos[i]
                let text = propEditorInfo.text
                let editorType = propEditorInfo.editorType
                let propNames = propEditorInfo.propNames
                let editor = React.createElement(editorType, {
                    value: commonFlatProps[propNames.join('.')],
                    onChange: (value) => {
                        for (let i = 0; i < controls.length; i++) {
                            let c = controls[i]
                            c.designer.updateControlProps(c.id, propNames, value)
                        }
                    }
                })
                editors.push({ text, editor })
            }

            this.setState({ editors })
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