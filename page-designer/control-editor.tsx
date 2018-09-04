namespace jueying {

    export interface EditorProps extends React.Props<Editor<any, any>> {
        control: Control<any, any>,
    }

    export abstract class Editor<P extends EditorProps, S> extends React.Component<P, S>{

        private originalRender: () => React.ReactNode;

        private validate: (() => Promise<boolean>) | null = null;

        private _element: HTMLElement | null = null;

        constructor(props: P) {
            super(props);

            console.assert(this.props.control.props != null);
            let controlProps = Object.assign({}, this.props.control.props);
            delete (controlProps as any).children;

            this.state = JSON.parse(JSON.stringify(controlProps));

            this.originalRender = this.render;
            this.render = () => {
                return this.originalRender ? this.originalRender() : null;
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
            // delete (controlProps as any).children;
            let keys = Object.getOwnPropertyNames(controlProps)
            for (let i = 0; i < keys.length; i++) {
                if (keys[i] == 'children')
                    continue

                this.state[keys[i]] = controlProps[keys[i]]
            }
            // this.state = JSON.parse(JSON.stringify(controlProps));
        }
    }
}