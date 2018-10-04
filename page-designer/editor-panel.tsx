namespace jueying {
    export interface EditorPanelState {
        componentDatas: ComponentData[];
        designer?: PageDesigner,
        selectedComponentId?: string,
    }

    export interface EditorPanelProps {
        className?: string;
        style?: React.CSSProperties;
        emptyText?: string
        designer?: PageDesigner
    }

    export class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
        private element: HTMLElement;
        private editor: ComponentEditor;

        constructor(props) {
            super(props);
            this.state = { componentDatas: [] };
        }

        componentWillReceiveProps(props: EditorPanelProps) {
            this.setState({ designer: props.designer })
        }

        // private update(designer: PageDesigner) {
        //     let selectedComponentDatas = designer.selectedComponents //designer.selectedComponentIds.map(o => designer.findComponentData(o))
        //     this.editor.setControls(selectedComponentDatas, designer)

        //     let componentDatas = []
        //     let stack = new Array<ComponentData>()
        //     stack.push(designer.pageData)
        //     while (stack.length > 0) {
        //         let item = stack.pop()
        //         componentDatas.push(item)
        //         let children = item.children || []
        //         for (let i = 0; i < children.length; i++) {
        //             stack.push(children[i])
        //         }
        //     }

        //     let selectedComponentId = selectedComponentDatas.length == 1 ? selectedComponentDatas[0].props.id : ''
        //     this.setState({ componentDatas, designer, selectedComponentId })
        // }
        private getComponentData(designer: PageDesigner) {
            // let selectedComponentDatas = designer.selectedComponents //designer.selectedComponentIds.map(o => designer.findComponentData(o))
            // this.editor.setControls(selectedComponentDatas, designer)

            let componentDatas = []
            let stack = new Array<ComponentData>()
            stack.push(designer.pageData)
            while (stack.length > 0) {
                let item = stack.pop()
                componentDatas.push(item)
                let children = item.children || []
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i])
                }
            }
            return componentDatas
        }
        render() {
            let { emptyText } = this.props;
            emptyText = emptyText || '';

            let componentDatas: ComponentData[] = []//this.state.componentDatas
            let designer = this.state.designer
            if (designer) {
                componentDatas = this.getComponentData(designer)
            }

            let selectedComponentId = this.state.selectedComponentId
            return <div className="editor-panel panel panel-primary" ref={(e: HTMLElement) => this.element = e || this.element}>
                <div className="panel-heading">属性</div>
                <div className="panel-body">
                    <div className="form-group">
                        <select className="form-control" value={selectedComponentId || ''}
                            onChange={e => {
                                if (designer && e.target.value)
                                    designer.selectComponent(e.currentTarget.value)
                            }}>
                            {componentDatas.map(o =>
                                <option key={o.props.id} id={o.props.id} value={o.props.id}>{o.props.name}</option>
                            )}
                        </select>
                    </div>
                    <ComponentEditor designer={designer} ref={e => this.editor = e || this.editor} />
                </div>

            </div>
        }
    }
}