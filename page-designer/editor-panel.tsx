namespace jueying {
    export interface EditorPanelState {
        // editor: React.ReactElement<any>,
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
        private editor: ControlEditor;

        constructor(props) {
            super(props);
            this.state = { selectedControl: null };
        }
        componentDidMount() {
            if (!this.designer)
                return;

            let onChanged = async () => {
                let controls = this.designer.selectedControlIds.map(id => Control.getInstance(id))
                this.editor.setControls(controls)
            }
            this.designer.controlSelected.add(onChanged)
            this.designer.controlRemoved.add(onChanged)
        }
        render() {
            let { emptyText } = this.props;
            emptyText = emptyText || '';
            return <DesignerContext.Consumer>
                {context => {
                    this.designer = context.designer;
                    return <div {...Control.htmlDOMProps(this.props)} className="editor-panel panel panel-primary" ref={(e: HTMLElement) => this.element = e || this.element}>
                        <div className="panel-heading">属性</div>
                        <div className="panel-body">
                            {/* {editor ? editor : <div className="empty">{emptyText}</div>} */}
                            <ControlEditor ref={e => this.editor = e || this.editor} />
                        </div>

                    </div>
                }}
            </DesignerContext.Consumer>
        }
    }
}