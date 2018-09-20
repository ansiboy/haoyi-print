
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

        setControl(control: Control<any, any>) {
            let controlProps = Object.assign({}, control.props);
            delete (controlProps as any).children;
            controlProps = JSON.parse(JSON.stringify(controlProps));

            let c = control
            let className = c.constructor.name
            let items: { text: string, editor: React.ReactElement<any> }[] = []
            let PropEditors = ControlPropEditors.getControlPropEditor(className)
            for (let i = 0; i < PropEditors.length; i++) {
                let { text, editorType, propName } = PropEditors[i]
                let editor = React.createElement(editorType, {
                    value: controlProps[propName],
                    onChange: (value) => {
                        let obj = {}
                        obj[propName] = value
                        c.designer.updateControlProps(c.id, obj)
                    }
                })
                items.push({ text, editor })
            }
            this.setState({ editors: items })
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