namespace jueying {

    export interface EditorProps extends React.Props<ControlEditor<any, any>> {
        control: Control<any, any>,
    }

    export class ControlEditor<P extends EditorProps, S> extends React.Component<P, S>{

        private originalRender: () => React.ReactNode;
        private _element: HTMLElement | null = null;

        constructor(props: P) {
            super(props);

            console.assert(this.props.control.props != null);
            let controlProps = Object.assign({}, this.props.control.props);
            delete (controlProps as any).children;

            this.state = JSON.parse(JSON.stringify(controlProps));

            this.originalRender = this.render;
            this.render = () => {
                let c = this.props.control
                let className = c.constructor.name
                let items: { text: string, editor: React.ReactElement<any> }[] = []
                let PropEditors = ControlPropEditors.getControlPropEditor(className)
                for (let propName in PropEditors) {
                    let { text, editorType } = PropEditors[propName]
                    let editor = editorType(c.props[propName], (value) => {
                        let obj = {}
                        obj[propName] = value
                        this.setState(obj)
                    })
                    items.push({ text, editor })
                }

                return this.Element(<React.Fragment>
                    {items.map((o, i) =>
                        <div key={i} className="form-group">
                            <label>{o.text}</label>
                            <div className="control">
                                {o.editor}
                            </div>
                        </div>
                    )}
                </React.Fragment>)
            }
        }

        get designer() {
            return this.props.control.designer;
        }

        get element() {
            return this._element;
        }

        setState<K extends keyof S>(
            state: (Pick<S, K> | S),
            callback?: () => void
        ): void {

            console.assert(state != null);
            if (this.designer) {
                this.designer.updateControlProps(this.props.control.id, state);
            }
            return super.setState(state, callback);
        }

        Element(...children: React.ReactElement<any>[]) {
            return React.createElement('div', {
                ref: (e) => {
                    this._element = e || this._element
                }
            }, ...children);
        }

        componentWillReceiveProps(props: P) {
            let controlProps = props.control.props;
            let keys = Object.getOwnPropertyNames(controlProps)
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] == 'children')
                    continue

                this.state[keys[i]] = controlProps[keys[i]]
            }
        }
    }
}