
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
            // if (!this.designer)
            //     return;

            // this.draggable($(`.${Control.connectorElementClassName}`));
            // this.designer.controlComponentDidMount.add((control) => {
            //     console.assert(control.element != null);
            //     this.draggable($(control.element));
            // })
        }

        // draggable(selector: JQuery) {
        //     $(this.toolbarElement).find('li').draggable({
        //         connectToSortable: $(`section, .${Control.connectorElementClassName}`),
        //         helper: "clone",
        //         revert: "invalid",
        //     })

        //     // this.props.componets.forEach(o => this.designer.addComponentDefine(o));
        // }

        private enableDraggable(element: HTMLElement, controlTypeName: string) {
            console.assert(element != null)
            element.draggable = true
            element.addEventListener('dragstart', function (ev) {
                ev.dataTransfer.setData(Control.controlTypeName, controlTypeName)
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
                                    props[Control.controlTypeName] = c.name;

                                    return <li {...props}
                                        ref={e => {
                                            if (!e) return
                                            this.enableDraggable(e, props[Control.controlTypeName])
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