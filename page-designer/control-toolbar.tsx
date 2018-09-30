
namespace jueying {
    export interface ComponentToolbarProps extends React.Props<ComponentToolbar> {
        componets: ComponentDefine[],
        style?: React.CSSProperties,
        className?: string,
    }
    export interface ComponentToolbarState {

    }
    export class ComponentToolbar extends React.Component<ComponentToolbarProps, ComponentToolbarState> {
        designer: PageDesigner;
        private toolbarElement: HTMLElement;


        componentDidMount() {
        }

        private componentDraggable(toolItemElement: HTMLElement, componentData: ComponentData) {
            console.assert(toolItemElement != null)
            toolItemElement.draggable = true
            toolItemElement.addEventListener('dragstart', function (ev) {
                componentData.props = componentData.props || {}
                ev.dataTransfer.setData(constants.componentData, JSON.stringify(componentData))
            })
        }

        render() {
            let props = Object.assign({}, this.props) as any;
            delete props.componets;

            let componets = this.props.componets;
            return <DesignerContext.Consumer>
                {context => {
                    this.designer = context.designer;
                    return <div {...props} className="component-panel panel panel-primary">
                        <div className="panel-heading">工具栏</div>
                        <div className="panel-body">
                            <ul ref={(e: HTMLElement) => this.toolbarElement = this.toolbarElement || e}>
                                {componets.map((c, i) => {
                                    let props = { key: i };
                                    return <li {...props}
                                        ref={e => {
                                            if (!e) return

                                            let ctrl = c.componentData
                                            this.componentDraggable(e, ctrl)
                                        }}>
                                        <div className="btn-link">
                                            <i className={c.icon} style={{ fontSize: 44, color: 'black' }} />
                                        </div>
                                        <div>
                                            {c.displayName}
                                        </div>
                                    </li>
                                })}
                            </ul>
                        </div>
                    </div>
                }}
            </DesignerContext.Consumer>
        }
    }
}