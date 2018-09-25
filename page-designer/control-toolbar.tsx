
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

        private componentDraggable(element: HTMLElement, controlTypeName: string) {
            console.assert(element != null)
            element.draggable = true
            element.addEventListener('dragstart', function (ev) {
                ev.dataTransfer.setData(constants.componentTypeName, controlTypeName)
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
                                    props[constants.componentTypeName] = c.name;

                                    return <li {...props}
                                        ref={e => {
                                            if (!e) return
                                            this.componentDraggable(e, props[constants.componentTypeName])
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