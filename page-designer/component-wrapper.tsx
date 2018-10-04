namespace jueying {

    type ComponentWrapperProps = {
        designer: PageDesigner,
        type: string | React.ComponentClass,
    } & ComponentProps<ComponentWrapper>
    
    export class ComponentWrapper extends React.Component<ComponentWrapperProps, any>{
        private handler: HTMLElement;
        private element: HTMLElement;
        private static isDrag: boolean = false;

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


        private static isResizeHandleClassName(className: string) {
            let classNames = [
                'resize_handle NE', 'resize_handle NN', 'resize_handle NW',
                'resize_handle WW', 'resize_handle EE', 'resize_handle SW',
                'resize_handle SS', 'resize_handle SE',
            ]
            return classNames.indexOf(className) >= 0
        }
        static draggable(designer: PageDesigner, element: HTMLElement, handler?: HTMLElement) {

            if (!designer) throw Errors.argumentNull('designer')
            if (!element) throw Errors.argumentNull('element')

            handler = handler || element
            let componentId = element.id
            console.assert(componentId)
            let startPos: JQuery.Coordinates
            let rect: { width?: number, height?: number, left?: number, top?: number };
            let dragStart: number
            $(handler)
                .drag("init", function (ev) {
                    startPos = $(element).position()
                    if ($(this).is(`.${classNames.componentSelected}`))
                        return $(`.${classNames.componentSelected}`);
                })
                .drag('start', function (ev, dd: DragData & { attr: string }) {
                    dd.attr = $(ev.target).prop("className");
                    dd.width = $(this).width();
                    dd.height = $(this).height();
                    dragStart = Date.now()
                })
                .drag(function (ev, dd: DragData & { attr: string }) {
                    ev.preventDefault()
                    ev.stopPropagation()

                    rect = {}
                    if (dd.attr.indexOf("E") > -1) {
                        rect.width = Math.max(32, dd.width + dd.deltaX);
                    }
                    if (dd.attr.indexOf("S") > -1) {
                        rect.height = Math.max(32, dd.height + dd.deltaY);
                    }
                    if (dd.attr.indexOf("W") > -1) {
                        rect.width = Math.max(32, dd.width - dd.deltaX);
                        setLeft(dd)
                    }
                    if (dd.attr.indexOf("N") > -1) {
                        rect.height = Math.max(32, dd.height - dd.deltaY);
                        setTop(dd)
                    }

                    if (dd.attr.indexOf("WW") >= 0)
                        setLeft(dd)
                    if (dd.attr.indexOf("NE") >= 0 || dd.attr.indexOf("NW") >= 0 || dd.attr.indexOf("SW") >= 0)
                        setPosition(dd)

                    if (dd.attr.indexOf("NN") >= 0)
                        setTop(dd)


                    if (dd.attr.indexOf("drag") > -1) {
                        rect.top = dd.offsetY;
                        rect.left = dd.offsetX;
                    }

                    if (!ComponentWrapper.isResizeHandleClassName(dd.attr)) {
                        setPosition(dd)
                    }

                    if (dd.attr)
                        $(this).css(rect);

                }, { click: true })
                .drag('end', function (ev, dd: DragData & { attr: string }) {
                    let interval = Date.now() - dragStart
                    ComponentWrapper.isDrag = interval >= 300

                    if (!ComponentWrapper.isResizeHandleClassName(dd.attr)) {
                        let left = startPos.left + dd.deltaX
                        let top = startPos.top + dd.deltaY
                        designer.setComponentPosition(element.id, { left, top })
                        element.style.transform = ''
                    }
                    else {
                        let left, top: number
                        if (dd.attr.indexOf("W") > -1)
                            left = startPos.left + dd.deltaX

                        if (dd.attr.indexOf("N") > -1)
                            top = startPos.top + dd.deltaY

                        element.style.transform = ''
                        designer.setComponentPosition(element.id, { left, top })
                        designer.setComponentSize(componentId, rect)
                    }
                })
                .click((ev) => {
                    ComponentWrapper.invokeOnClick(ev as any, designer, element)
                })

            let setPosition = (dd: DragData) => {
                console.log(['dd.offsetX, dd.offsetY', dd.offsetX, dd.offsetY])
                console.log(dd)
                element.style.transform = `translate(${dd.deltaX}px,${dd.deltaY}px)`
            }

            let setTop = (dd: DragData) => {
                element.style.transform = `translateY(${dd.deltaY}px)`
            }
            let setLeft = (dd: DragData) => {
                element.style.transform = `translateX(${dd.deltaX}px)`
            }


        }

        static invokeOnClick(ev: MouseEvent, designer: PageDesigner, element: HTMLElement) {
            ev.preventDefault()
            ev.stopPropagation()

            if (ComponentWrapper.isDrag) {
                ComponentWrapper.isDrag = false
                return
            }

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

            let attr = Component.getAttribute(typename)
            this.designtimeBehavior(this.element, attr)
        }

        render() {

            let style = this.props.style || {}
            let { top, left, position, width, height, display, visibility } = style

            let props = this.props
            let wrapperProps: ComponentProps<any> & React.HTMLAttributes<any> = {
                id: props.id,
                className: props.selected ? `${classNames.componentSelected} ${classNames.component}` : classNames.component,
                style: { top, left, position, width, height, display, visibility },
                ref: (e: HTMLElement) => this.element = e || this.element
            }

            let type = this.props.type
            let typename = typeof type == 'string' ? type : type.name
            let attr = Component.getAttribute(typename)
            let move_handle = this.props.selected && attr.showHandler ? <div className="move_handle" style={{}}
                ref={e => this.handler = e || this.handler} /> : null

            return <div {...wrapperProps}>
                {move_handle}
                {attr.resize ?
                    <>
                        <div className="resize_handle NE"></div>
                        <div className="resize_handle NN"></div>
                        <div className="resize_handle NW"></div>
                        <div className="resize_handle WW"></div>
                        <div className="resize_handle EE"></div>
                        <div className="resize_handle SW"></div>
                        <div className="resize_handle SS"></div>
                        <div className="resize_handle SE"></div>
                    </> : null}
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
        resize?: boolean,
    }



}