
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

        private componentDraggable(element: HTMLElement, ctrl: ComponentData) {
            console.assert(element != null)
            element.draggable = true
            element.addEventListener('dragstart', function (ev) {
                // ev.dataTransfer.setData(constants.componentData, componentTypeName)
                ctrl.props = ctrl.props || {}

                let defaultStyle = {}
                let componentTypeName = ctrl.type
                let componentType = core.componentType(componentTypeName) || componentTypeName
                if (componentType != null && typeof componentType != 'string' && componentType.defaultProps != null) {
                    defaultStyle = componentType.defaultProps.style || {}
                }

                let left = ev.layerX;
                let top = ev.layerY;

                let style = Object.assign(defaultStyle, {
                    position: 'absolute', //TODO: 不要写死
                    left,
                    top,
                } as React.CSSProperties, ctrl.props.style || {})

                ctrl.props.style = style

                ev.dataTransfer.setData(constants.componentData, JSON.stringify(ctrl))
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
                                    // props[constants.componentTypeName] = c.name;

                                    return <li {...props}
                                        ref={e => {
                                            if (!e) return


                                            // let ctrl: ElementData = {
                                            //     type: c.name,
                                            //     props: {
                                            //         id: guid(),

                                            //     }
                                            // };
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