namespace jueying {

    export type DesignerContextValue = { designer: PageDesigner | null };
    export const DesignerContext = React.createContext<DesignerContextValue>({ designer: null });

    export interface DesigntimeComponent {
        /** 运行时控件的类型名称 */
        typename: string
    }

    export function component(args?: { container: boolean }) {
        args = args || {} as any
        return function (constructor: { new(arg): {} }) {
            let c = constructor as any as React.ComponentClass<ControlProps<any>, any>
            let result = class ComponetWraper extends c implements DesigntimeComponent {
                wrapperElement: HTMLElement
                designer: PageDesigner
                get typename(): string {
                    return constructor.name
                }

                get id() {
                    return this.props.id
                }

                constructor(props) {
                    super(props)
                    Control.addInstance(this.id, this)
                }

                componentDidMount() {
                    if (super.componentDidMount)
                        super.componentDidMount()

                    if (this.designer != null) {
                        this.designtimeComponentDidMount()
                    }
                }

                designtimeComponentDidMount() {
                    if (args.container) {
                        PageDesigner.enableDroppable(this.wrapperElement, this.designer)
                        this.designer.selectedControlIds
                            .map(id => document.getElementById(id))
                            .filter(o => o)
                            .forEach(element => {
                                if ($(element).parents(`#${this.wrapperElement.id}`).length) {
                                    console.assert(element.id, 'control id is null or empty.');
                                    PageDesigner.draggableElement(element, this.designer, this.wrapperElement)
                                }
                            })
                    }
                }

                render() {
                    return <DesignerContext.Consumer>
                        {c => {
                            this.designer = c.designer
                            if (this.designer) {
                                return this.renderDesigntime()
                            }

                            return super.render()
                        }}
                    </DesignerContext.Consumer>
                }

                renderDesigntime() {
                    console.assert(this.id != null)
                    let style = (this.props.style || {}) as React.CSSProperties
                    let { left, top, position } = style

                    return <div id={this.id} ref={e => this.wrapperElement = e || this.wrapperElement} className={this.props.selected ? classNames.controlSelected : ''}
                        style={{ left, top, position }}
                        onClick={e => this.mouseDownOrClick(e)}
                        onMouseDown={e => this.mouseDownOrClick(e)}>
                        {(() => {

                            let createElement = React.createElement
                            React.createElement = ControlFactory.createDesignTimeElement as any

                            let s = super.render()
                            React.createElement = createElement

                            return s
                        })()}
                    </div>



                    return result
                }

                mouseDownOrClick(e: React.MouseEvent<any>) {
                    console.log(`event type:${event.type}`)
                    let selectedControlIds = this.designer.selectedControlIds //[this.id]

                    //========================================================================
                    // 如果是多个 click 事件选中
                    if (selectedControlIds.length > 1 && event.type == 'react-mousedown') {
                        return
                    }
                    //========================================================================

                    if (e.ctrlKey) {
                        if (selectedControlIds.indexOf(this.wrapperElement.id) >= 0) {
                            selectedControlIds = selectedControlIds.filter(o => o != this.wrapperElement.id)
                        }
                        else {
                            selectedControlIds.push(this.wrapperElement.id)
                        }
                    }
                    else {
                        selectedControlIds = [this.wrapperElement.id]
                    }

                    console.assert(this.designer != null)
                    this.designer.selectControl(selectedControlIds)

                    e.stopPropagation();
                }
            }

            ControlFactory.register(constructor.name, result)

            return result
        }
    }


}


