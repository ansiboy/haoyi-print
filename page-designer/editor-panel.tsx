namespace jueying {
    export interface EditorPanelState {
        editor: React.ReactElement<any>,
        // editors: { [key: string]: React.ReactElement<any> },
    }

    export interface EditorPanelProps {
        className?: string;
        style?: React.CSSProperties;
        emptyText?: string
    }

    export class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
        private designer: PageDesigner;
        private element: HTMLElement;

        constructor(props) {
            super(props);
            this.state = { editor: null };
        }
        componentDidMount() {
            if (!this.designer)
                return;

            let onChanged = async (control: Control<any, any>) => {
                if (control == null) {
                    this.setState({ editor: null });
                    return;
                }
                if (!control.hasEditor) {
                    console.log(`Control ${control.constructor.name} has none editor.`);
                    return;
                }

                let editor = await ControlEditorFactory.create(control);
                this.setState({ editor });
            }
            this.designer.controlSelected.add(onChanged)
        }
        render() {
            let { editor } = this.state;
            let { emptyText } = this.props;
            emptyText = emptyText || '';
            return <DesignerContext.Consumer>
                {context => {
                    this.designer = context.designer;
                    return <div {...Control.htmlDOMProps(this.props)} className="editor-panel panel panel-primary" ref={(e: HTMLElement) => this.element = e || this.element}>
                        <div className="panel-heading">属性</div>
                        <div className="panel-body">
                            {editor ? editor : <div className="empty">{emptyText}</div>}
                        </div>

                    </div>
                }}
            </DesignerContext.Consumer>
        }
    }
}