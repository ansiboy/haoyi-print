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
        private element: HTMLElement;
        private editor: ControlEditor;

        constructor(props) {
            super(props);
            this.state = { };
        }
        setControls(controlIds: string[]): any {
            let controls = controlIds.map(id => Control.getInstance(id))
            this.editor.setControls(controls)
        }
        render() {
            let { emptyText } = this.props;
            emptyText = emptyText || '';
            return <DesignerContext.Consumer>
                {context => {
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