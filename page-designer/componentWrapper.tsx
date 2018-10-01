namespace jueying {
    export interface ComponentWrapperProps {
        id: string,
        style: React.CSSProperties,
        type: string | React.ComponentClass,
        selected: boolean,
        designer: PageDesigner
    }


    export class ComponentWrapper extends React.Component<ComponentWrapperProps, any>{
        private handler: HTMLElement;
        private element: HTMLElement;
        designtimeBehavior(element: HTMLElement, attr: { container?: boolean, movable?: boolean }) {
            if (!element) throw Errors.argumentNull('element')
            if (!attr) throw Errors.argumentNull('args')

            let designer = this.props.designer
            console.assert(attr.container != null)
            console.assert(attr.movable != null)
            if (attr.container) {
                ComponentWrapper.enableDroppable(element, designer)
            }
            if (attr.movable) {
                console.assert(element != null)
                ComponentWrapper.draggable(designer, element)
                if (this.handler != null)
                    ComponentWrapper.draggable(designer, element, this.handler)
            }
            else {
                element.onclick = (ev) => ComponentWrapper.invokeOnClick(ev, designer, element)
            }
        }

        /**
         * 启用拖放操作，以便通过拖放图标添加控件
         */
        static enableDroppable(element: HTMLElement, designer: PageDesigner) {
            console.assert(element != null)
            element.addEventListener('dragover', function (event) {
                event.preventDefault()
                event.stopPropagation()

                let componentName = event.dataTransfer.getData(constants.componentData)
                if (componentName)
                    event.dataTransfer.dropEffect = "copy"
                else
                    event.dataTransfer.dropEffect = "move"

                console.log(`dragover: left:${event.layerX} top:${event.layerX}`)
            })
            element.ondrop = (event) => {
                event.preventDefault()
                event.stopPropagation()

                let componentData = event.dataTransfer.getData(constants.componentData)
                if (!componentData) {
                    return
                }

                let ctrl = JSON.parse(componentData) as ComponentData

                ctrl.props.style = ctrl.props.style || {}
                designer.pageData.props.style = designer.pageData.props.style || {}
                if (!ctrl.props.style.position) {
                    ctrl.props.style.position = designer.pageData.props.style.position
                }

                if (ctrl.props.style.position == 'absolute') {
                    ctrl.props.style.left = event.layerX
                    ctrl.props.style.top = event.layerY
                }
                designer.appendComponent(element.id, ctrl);
            }
        }


        static draggable(designer: PageDesigner, element: HTMLElement, handler?: HTMLElement) {

            if (!designer) throw Errors.argumentNull('designer')
            if (!element) throw Errors.argumentNull('element')

            handler = handler || element
            let elementID = element.id
            console.assert(elementID)
            let startPos: JQuery.Coordinates
            $(handler)
                .drag("init", function (ev) {
                    startPos = $(element).position()
                    if ($(this).is(`.${classNames.componentSelected}`))
                        return $(`.${classNames.componentSelected}`);
                })
                .drag(function (ev, dd) {
                    ev.preventDefault()
                    ev.stopPropagation()

                    setPosition(ev, dd)

                }, { click: true })
                .drag('end', function (ev, dd) {
                    let left = startPos.left + dd.deltaX
                    let top = startPos.top + dd.deltaY
                    designer.setControlPosition(element.id, left, top)
                    element.style.transform = ''
                })
                .click((ev) => ComponentWrapper.invokeOnClick(ev as any, designer, element))

            let setPosition = (ev: JQuery.Event<any>, dd: DD) => {
                console.log(['ev.offsetX, ev.offsetY', ev.offsetX, ev.offsetY])
                console.log(['dd.offsetX, dd.offsetY', dd.offsetX, dd.offsetY])
                console.log(ev)
                console.log(dd)
                element.style.transform = `translate(${dd.deltaX}px,${dd.deltaY}px)`
            }
        }

        private static invokeOnClick(ev: MouseEvent, designer: PageDesigner, element: HTMLElement) {
            ev.preventDefault()
            ev.stopPropagation()

            let elementID = element.id
            if (!ev.ctrlKey) {
                designer.selectComponent(element.id)
                return
            }

            let selectedControlIds = designer.selectedComponentIds
            console.assert(elementID)
            if (selectedControlIds.indexOf(elementID) >= 0) {
                selectedControlIds = selectedControlIds.filter(o => o != elementID)
            }
            else {
                selectedControlIds.push(elementID)
            }
            designer.selectComponent(selectedControlIds)
        }

        componentDidMount() {
            if (this.element.getAttribute('data-behavior')) {
                return
            }
            this.element.setAttribute('data-behavior', 'behavior')

            let type = this.props.type
            let typename = typeof type == 'string' ? type : type.name

            let attr = Component.getComponentAttribute(typename)
            this.designtimeBehavior(this.element, attr)
        }

        render() {

            let style = this.props.style || {}
            let { top, left, position, width, height } = style

            let props = this.props
            let wrapperProps: ComponentProps<any> & React.HTMLAttributes<any> = {
                id: props.id,
                className: props.selected ? `${classNames.componentSelected} ${classNames.component}` : classNames.component,
                style: { top, left, position, width, height },
                ref: (e: HTMLElement) => this.element = e || this.element
            }

            let type = this.props.type
            let typename = typeof type == 'string' ? type : type.name
            let attr = Component.getComponentAttribute(typename)
            let handler = this.props.selected && attr.showHandler ? <div style={{ height: 12, width: 12, top: -6, left: 8, border: 'solid 1px black', position: 'absolute' }}
                ref={e => this.handler = e || this.handler} /> : null

            return <div {...wrapperProps}>
                {handler}
                {this.props.children}
            </div>
        }
    }


    export interface ComponentAttribute {
        /** 表示组件为容器，可以添加组件 */
        container?: boolean,
        /** 表示组件可移动 */
        movable?: boolean,
        showHandler?: boolean,
    }


    export class Component {
        private static defaultComponentAttribute: ComponentAttribute = {
            container: false, movable: true, showHandler: false
        }

        private static componentAttributes: { [key: string]: ComponentAttribute } = {
            'table': { container: false, movable: true, showHandler: true },
            'thead': { container: false, movable: false },
            'tbody': { container: false, movable: false },
            'tfoot': { container: false, movable: false },
            'tr': { container: false, movable: false },
            'td': { container: true, movable: false },

            'img': { container: false, movable: true },

            'div': { container: true, movable: true, showHandler: true },
        }

        static setComponentAttribute(typename: string, attr: ComponentAttribute) {
            Component.componentAttributes[typename] = attr
        }

        static getComponentAttribute(typename: string) {
            let attr = Component.componentAttributes[typename]
            return Object.assign({}, Component.defaultComponentAttribute, attr || {})
        }
    }
}