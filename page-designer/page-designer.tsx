/*******************************************************************************
 * Copyright (C) maishu All rights reserved.
 *
 * HTML 页面设计器 
 * 
 * 作者: 寒烟
 * 日期: 2018/5/30
 *
 * 个人博客：   http://www.cnblogs.com/ansiboy/
 * GITHUB:     http://github.com/ansiboy
 * QQ 讨论组：  119038574
 * 
 ********************************************************************************/

namespace jueying {

    export interface PageDesignerProps extends React.Props<PageDesigner> {
        pageData: ComponentData | null,
    }

    export interface PageDesignerState {
        pageData: ComponentData | null
    }

    export class Callback<T> {
        private funcs = new Array<(...args: Array<any>) => void>();

        constructor() {
        }

        add(func: (args: T) => void) {
            this.funcs.push(func);
        }
        remove(func: (args: T) => any) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(args: T) {
            this.funcs.forEach(o => o(args));
        }

        static create<T>() {
            return new Callback<T>();
        }
    }

    export interface ComponentProps<T> extends React.Props<T> {
        id?: string,
        name?: string,
        className?: string,
        style?: React.CSSProperties,
        tabIndex?: number,
        componentName?: string,
        designMode?: boolean,
        selected?: boolean,
    }


    export class PageDesigner extends React.Component<PageDesignerProps, PageDesignerState> {

        private _selectedControlIds: string[] = [];
        element: HTMLElement;

        controlSelected = Callback.create<string[]>();
        controlRemoved = Callback.create<string[]>()
        designtimeComponentDidMount = Callback.create<{ component: React.ReactElement<any>, element: HTMLElement }>();
        componentUpdated = Callback.create<PageDesigner>()

        private draggableElementIds: string[] = []

        names = new Array<string>();

        constructor(props: PageDesignerProps) {
            super(props);

            this.initSelectedIds(props.pageData)
            let pageData = this.convertHTMLTag(props.pageData)
            this.state = { pageData };
            this.designtimeComponentDidMount.add((args) => {
                console.log(`this:designer event:controlComponentDidMount`)
            })
        }

        initSelectedIds(pageData: ComponentData) {
            if (pageData == null) {
                this._selectedControlIds = []
                return
            }
            let stack = new Array<ComponentData>()
            stack.push(pageData)
            while (stack.length > 0) {
                let item = stack.pop()
                let props = item.props as ComponentProps<any>
                if (props.selected) {
                    console.assert(props.id)
                    this._selectedControlIds.push(props.id)
                }
                (item.children || []).forEach(o => {
                    stack.push(o)
                })
            }
        }

        componentWillReceiveProps(props: PageDesignerProps) {
            this.initSelectedIds(props.pageData)
            let pageData = this.convertHTMLTag(props.pageData)
            this.setState({ pageData });
        }

        componentDidUpdate() {
            this.componentUpdated.fire(this)
        }


        get pageData() {
            return this.state.pageData;
        }

        get selectedComponentIds() {
            return this._selectedControlIds
        }

        updateControlProps(controlId: string, navPropsNames: string[], value: any): any {
            let controlDescription = this.findComponentData(controlId);
            if (controlDescription == null)
                return

            console.assert(controlDescription != null);
            console.assert(navPropsNames != null, 'props is null');

            controlDescription.props = controlDescription.props || {};

            let obj = controlDescription.props
            for (let i = 0; i < navPropsNames.length - 1; i++) {
                obj = obj[navPropsNames[i]] = obj[navPropsNames[i]] || {};
            }

            obj[navPropsNames[navPropsNames.length - 1]] = value
            this.setState(this.state);
        }

        /**
        * 启用拖放操作，以便通过拖放图标添加控件
        */
        enableDroppable(element: HTMLElement) {
            // let element = this.element
            let designer: PageDesigner = this
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
                if (ctrl.props.style != null && ctrl.props.style.position == 'absolute') {
                    ctrl.props.style.left = event.layerX
                    ctrl.props.style.top = event.layerY
                }
                designer.appendControl(element.id, ctrl);
            }
        }

        private findContainerComponentId(element: HTMLElement): ComponentData {
            if (element.id) {
                let controlData = this.findComponentData(element.id)
                if (controlData != null)
                    return controlData
            }

            let parent = element.parentElement
            if (parent != null && parent != this.element) {
                return this.findContainerComponentId(parent)
            }

            return null
        }

        //======================================================================================
        // 事件
        private mouseEvent() {

            //=====================================================
            // 组件的选取

            /**
             * 将鼠标点中的组件设置为选中状态 
             * 如果已选择的组件数量为 0 或者 1，mousedown 事件为选择当前组件  
             * */
            this.element.onclick = (e: MouseEvent) => {

                // 由于拖放会产生 onclick 事件，所有需要判断如果是拖放操作
                // 则取消当前的 onclick 操作
                if (dragExecuted) {
                    dragExecuted = false
                    console.log(`component select implement, onclick dragExecuted = false`)
                    return
                }

                let target = e.target as HTMLElement
                let componentData = this.findContainerComponentId(target)
                console.assert(componentData != null)
                console.log(`designer event:${e.type} target:${target.tagName}`)
                let componentId = componentData.props.id

                // 按下 CTRL 为多选，以及反选操作
                if (e.ctrlKey) {


                    let selectedComponentIds = this.selectedComponentIds
                    if (selectedComponentIds.indexOf(componentId) >= 0) {
                        selectedComponentIds = selectedComponentIds.filter(o => o != componentId)
                    }
                    else {
                        selectedComponentIds.push(componentId)
                    }

                    console.assert(this != null)
                    this.selectComponent(selectedComponentIds)
                }
                else {
                    this.selectComponent([componentId])
                }
            }


            //=====================================================
            // 以下代码为实现拖放操作
            let dragExecuted: boolean
            let isDragOperation = false
            let x: number, y: number;
            let deltaX: number, deltaY: number;
            const MIN_DELTA = 3
            let startPositions: { left: number, top: number, element: HTMLElement }[]
            this.element.addEventListener('mousedown', (ev: MouseEvent) => {
                if (ev.shiftKey || ev.ctrlKey || ev.metaKey) {
                    return
                }

                isDragOperation = true
                x = ev.clientX
                y = ev.clientY

                let target = ev.target as HTMLElement
                let componentData = this.findContainerComponentId(target)
                if (!componentData.props.selected) {
                    this.selectComponent([componentData.props.id])
                }

                startPositions = this.selectedComponentIds
                    .filter(o => this.draggableElementIds.indexOf(o) >= 0)
                    .map(o => document.getElementById(o))
                    .map(o => {
                        let { left, top } = $(o).position()
                        return { left, top, element: o }
                    })
            })
            this.element.addEventListener('mousemove', (ev: MouseEvent) => {
                if (!isDragOperation || ev.shiftKey || ev.ctrlKey || ev.metaKey)
                    return

                deltaX = ev.clientX - x
                deltaY = ev.clientY - y

            })

            // 采用定时更新位置，以提高性能
            setInterval(() => {
                if (deltaX == null || deltaY == null || startPositions.length == 0)
                    return

                startPositions.forEach(pos => {
                    let { left, top, element } = pos
                    // element.style.transform = "translate3d(" + deltaX + "px, " + deltaY + "px, 0)";
                    element.style.left = `${left + deltaX}px`
                    element.style.top = `${top + deltaY}px`
                })
            }, 30)

            this.element.addEventListener('mouseup', (ev: MouseEvent) => {
                if (ev.shiftKey || ev.ctrlKey || ev.metaKey) {
                    return
                }

                ev.stopPropagation()
                ev.preventDefault()

                console.log(`mouseup deltaX:${deltaX} deltaY:${deltaY}`)
                if (Math.abs(deltaX) >= MIN_DELTA || Math.abs(deltaY) >= MIN_DELTA) {
                    let positions = startPositions.map(pos => ({
                        controlId: pos.element.id,
                        left: pos.left + deltaX,
                        top: pos.top + deltaY
                    }))

                    startPositions.forEach(o => {
                        o.element.style.removeProperty('transform')
                    })

                    this.setControlsPosition(positions)
                    dragExecuted = true
                    console.log(`drag implement, mouseup dragExecuted = true`)
                }

                // init data
                isDragOperation = false
                x = y = deltaX = deltaY = null
                startPositions = []
            })

            // 拖放代码结束
            //======================================================================================

        }

        private sortControlChildren(controlId: string, childIds: string[]): void {
            let c = this.findComponentData(controlId)
            if (c == null)
                return

            let children = c.children || []
            c.children = childIds.map(o => children.filter(a => a.props.id == o)[0]).filter(o => o != null);

            let { pageData } = this.state;
            this.setState({ pageData });
        }

        private sortChildren(parentId: string, childIds: string[]) {
            if (!parentId) throw Errors.argumentNull('parentId');
            if (!childIds) throw Errors.argumentNull('childIds');

            let pageData = this.state.pageData;
            let parentControl = this.findComponentData(parentId);
            if (parentControl == null)
                throw new Error('Parent is not exists')

            console.assert(parentControl != null);
            console.assert(parentControl.children != null);
            console.assert((parentControl.children || []).length == childIds.length);

            let p = parentControl
            parentControl.children = childIds.map(o => {
                let child = p.children.filter(a => a.props.id == o)[0];
                console.assert(child != null, `child ${o} is null`);
                return child;
            });

            this.setState({ pageData });
        }

        private namedControl(control: ComponentData) {
            let props = control.props = control.props || {};
            if (!props.name) {
                let num = 0;
                let name: string;
                do {
                    num = num + 1;
                    name = `${control.type}${num}`;
                } while (this.names.indexOf(name) >= 0);

                this.names.push(name);
                props.name = name;
            }

            if (!props.id)
                props.id = guid();

            if (!control.children || control.children.length == 0) {
                return;
            }
            for (let i = 0; i < control.children.length; i++) {
                this.namedControl(control.children[i]);
            }
        }

        /** 添加控件 */
        appendControl(parentId: string, childControl: ComponentData, childIds?: string[]) {
            if (!parentId) throw Errors.argumentNull('parentId');
            if (!childControl) throw Errors.argumentNull('childControl');

            // childControl = this.convertHTMLTag(childControl)
            this.namedControl(childControl)
            let parentControl = this.findComponentData(parentId);
            if (parentControl == null)
                throw new Error('Parent is not exists')

            console.assert(parentControl != null);
            parentControl.children = parentControl.children || [];
            parentControl.children.push(childControl);
            if (childIds)
                this.sortChildren(parentId, childIds);
            else {
                let { pageData } = this.state;
                this.setState({ pageData });
            }

            this.selectComponent(childControl.props.id);

        }

        /** 设置控件位置 */
        setControlPosition(controlId: string, left: number | string, top: number | string) {
            let controlData = this.findComponentData(controlId);
            if (!controlData)
                throw new Error(`Control ${controlId} is not exits.`);

            let style = controlData.props.style = (controlData.props.style || {});
            style.left = left;
            style.top = top;

            let { pageData } = this.state;
            this.setState({ pageData });
        }

        setControlsPosition(positions: { controlId: string, left: number | string, top: number | string }[]) {
            positions.forEach(o => {
                let { controlId, left, top } = o
                let controlData = this.findComponentData(controlId);
                if (!controlData)
                    throw new Error(`Control ${controlId} is not exits.`);

                let style = controlData.props.style = (controlData.props.style || {});
                style.left = left;
                style.top = top;

                let { pageData } = this.state;
                this.setState({ pageData });
            })

        }

        /**
         * 选择指定的控件
         * @param control 指定的控件
         */
        selectComponent(controlIds: string[] | string): void {

            if (typeof controlIds == 'string')
                controlIds = [controlIds]


            var stack: ComponentData[] = []
            stack.push(this.pageData)
            while (stack.length > 0) {
                let item = stack.pop()
                let isSelectedControl = controlIds.indexOf(item.props.id) >= 0
                item.props.selected = isSelectedControl
                let children = item.children || []
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i])
                }
            }

            this._selectedControlIds = controlIds
            controlIds.map(id => this.findComponentData(id)).forEach(o => {
                let props = o.props as ComponentProps<any>
                props.selected = true
            })
            this.setState({ pageData: this.pageData })
            this.controlSelected.fire(this.selectedComponentIds)
        }

        /** 移除控件 */
        removeControl(...controlIds: string[]) {
            let pageData = this.state.pageData;
            if (!pageData || !pageData.children || pageData.children.length == 0)
                return;


            controlIds.forEach(controlId => {
                this.removeControlFrom(controlId, pageData.children);
            })

            this._selectedControlIds = this._selectedControlIds.filter(id => controlIds.indexOf(id) < 0)
            this.setState({ pageData });

            this.controlRemoved.fire(controlIds)
        }

        /** 移动控件到另外一个控件容器 */
        moveControl(controlId: string, parentId: string, childIds: string[]) {
            let control = this.findComponentData(controlId);
            if (control == null)
                throw new Error(`Cannt find control by id ${controlId}`)

            console.assert(control != null, `Cannt find control by id ${controlId}`);

            let pageData = this.state.pageData;
            console.assert(pageData.children);
            this.removeControlFrom(controlId, pageData.children);
            this.appendControl(parentId, control, childIds);
        }

        private removeControlFrom(controlId: string, collection: ComponentData[]): boolean {
            debugger
            let controlIndex: number | null = null;
            for (let i = 0; i < collection.length; i++) {
                if (controlId == collection[i].props.id) {
                    controlIndex = i;
                    break;
                }
            }

            if (controlIndex == null) {
                for (let i = 0; i < collection.length; i++) {
                    let o = collection[i];
                    if (o.children && o.children.length > 0) {
                        let isRemoved = this.removeControlFrom(controlId, o.children)
                        if (isRemoved) {
                            return true;
                        }
                    }
                }

                return false;
            }

            if (controlIndex == 0) {
                collection.shift();
            }
            else if (controlIndex == collection.length - 1) {
                collection.pop();
            }
            else {
                collection.splice(controlIndex, 1);
            }

            return true;
        }

        findComponentData(controlId: string): ComponentData | null {
            let pageData = this.state.pageData;
            if (!pageData)
                throw Errors.pageDataIsNull();

            let stack = new Array<ComponentData>();
            stack.push(pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                if (item == null)
                    continue

                if (item.props.id == controlId)
                    return item;

                let children = (item.children || []).filter(o => typeof o == 'object') as ComponentData[]
                stack.push(...children);
            }

            return null;
        }

        private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
            const DELETE_KEY_CODE = 46;
            if (e.keyCode == DELETE_KEY_CODE) {
                if (this._selectedControlIds.length == 0)
                    return

                this.removeControl(...this._selectedControlIds)
            }
        }

        /**
         * 对设计时元素进行处理
         * 1. 可以根据设定是否移到该元素
         * 2. 可以根据设定是否允许添加组件到该元素
         * @param element 设计时元素
         * @param args 
         */
        designtimeBehavior(element: HTMLElement, args: { container?: boolean, movable?: boolean }) {
            if (args.container) {
                this.enableDroppable(element)
            }
            if (args.movable) {
                // let element = document.getElementById(element.id)
                console.assert(element != null)
                // this.draggableElementIds.push(element.id)

                this.draggableElement(element)
            }
        }

        static createDesigntimeClass<T>(constructor: { new(...args): T }, args: { container?: boolean, movable?: boolean }) {
            let c = constructor as any as React.ComponentClass<ComponentProps<any>, any>
            let result = class ComponetWraper extends c implements DesigntimeComponent {
                wrapperElement: HTMLElement
                designer: PageDesigner
                id: string
                constructor(props, context) {
                    super(props, context)

                    this.id = this.props.id || guid()
                    // Control.addInstance(this.id, this)
                }

                get typename(): string {
                    return constructor.name
                }

                render() {
                    return <DesignerContext.Consumer>
                        {c => {
                            this.designer = c.designer
                            if (this.designer) {
                                let component = this.renderDesigntime()
                                this.designer.designtimeComponentDidMount.fire({ component, element: this.wrapperElement })
                                return component
                            }

                            return super.render()
                        }}
                    </DesignerContext.Consumer>
                }

                renderDesigntime() {
                    console.assert(this.id != null)
                    let style = (this.props.style || {}) as React.CSSProperties
                    let { left, top, position } = style

                    return <div id={this.id}
                        ref={e => {
                            if (!e) return
                            this.wrapperElement = e
                            if ($(e).data('designtimeBehavior')) {
                                return
                            }

                            $(e).data('designtimeBehavior', 'designtimeBehavior')
                            this.designer.designtimeBehavior(e, args)
                        }}
                        className={this.props.selected ? `${classNames.componentSelected} ${classNames.component}` : classNames.component}
                        style={{ left, top, position }} >
                        {(() => {

                            let createElement = React.createElement
                            React.createElement = designTimeCreateElement as any

                            let s = super.render()
                            React.createElement = createElement

                            return s
                        })()}
                    </div>
                }


            }

            core.register(constructor.name, result)

            return result
        }

        convertHTMLTag(componentData: ComponentData) {

            let typename = componentData.type
            let isHTMLTag = core.customControlTypes[typename] == null && typename.toLowerCase() == typename
            componentData.children = (componentData.children || []).map(o => this.convertHTMLTag(o))

            if (isHTMLTag) {
                // let tmp = componentData
                // componentData = {
                //     type: HTMLTag.name,
                //     props: {},
                //     children: [tmp]
                // }
                // return componentData
                componentData.type = HTMLTag.name
            }

            return componentData
        }

        private draggableElement(element: HTMLElement) {

            let designerPosition = $(this.element).offset()
            let elementID = element.id
            console.assert(elementID)
            $(element)
                // .mousedown((ev) => {
                //     if (ev.ctrlKey) {
                //         return
                //     }
                //     $(`${classNames.componentSelected}`).removeClass(`${classNames.componentSelected}`)
                //     $(this).addClass(classNames.componentSelected);

                //     console.assert(elementID)
                //     this.selectComponent(elementID)
                // })
                .click(ev => {
                    if (!ev.ctrlKey) {
                        this.selectComponent(element.id)
                        return
                    }

                    // $(this).toggleClass(classNames.componentSelected)
                    console.assert(elementID)
                    if (this._selectedControlIds.indexOf(elementID) >= 0) {
                        this._selectedControlIds = this._selectedControlIds.filter(o => o != elementID)
                    }
                    else {
                        this._selectedControlIds.push(elementID)
                    }
                    this.selectComponent(this._selectedControlIds)


                })
                .drag("init", function () {
                    if ($(this).is(`.${classNames.componentSelected}`))
                        return $(`.${classNames.componentSelected}`);
                })
                .drag(function (ev, dd) {
                    setPosition(ev, dd, this)
                }, { click: false });

            let offsetX, offsetY: number

            function setPosition(ev: JQuery.Event<any>, dd, element: any) {
                let left = dd.offsetX - designerPosition.left
                let top = dd.offsetY - designerPosition.top
                console.log(['ev.offsetX, ev.offsetY', ev.offsetX, ev.offsetY])
                console.log(['dd.offsetX, dd.offsetY', dd.offsetX, dd.offsetY])
                console.log(ev)
                console.log(dd)
                $(element).css({
                    top, left
                });

            }

        }

        componentDidMount() {
            // let designerPosition = $('.page-view').position()
            // setTimeout(() => {
            // let designerPosition = $(this.element).offset()
            // console.log(designerPosition)
            // // }, 1000)
            // let self = this
            // $(this.element)
            //     .on("drag", `.${classNames.component}`, function (ev, dd) {
            //         setPosition(ev, dd, this)
            //         $
            //     })
            //     .on('mousedown', `.${classNames.component}`, function (ev, dd) {
            //         // if (ev.ctrlKey) {
            //         //     return
            //         // }
            //         // $(`${classNames.componentSelected}`).removeClass(`${classNames.componentSelected}`)
            //         // $(self).addClass(classNames.componentSelected);

            //         // let elementId = this.id as string
            //         // self.selectComponent(elementId)
            //     })
            //     .drag("init", function () {
            //         if ($(this).is(`.${classNames.componentSelected}`))
            //             return $(`.${classNames.componentSelected}`);
            //     })
            //     .on('click', `.${classNames.component}`, function (ev, dd) {
            //         // if (!ev.ctrlKey)
            //         //     return

            //         let elementId = this.id as string
            //         console.assert(elementId)
            //         if (self._selectedControlIds.indexOf(elementId) >= 0) {
            //             self._selectedControlIds = self._selectedControlIds.filter(o => o != elementId)
            //         }
            //         else {
            //             self._selectedControlIds.push(elementId)
            //         }
            //         self.selectComponent(self._selectedControlIds)
            //     });


            // setInterval(() => {
            //     this.selectedComponentIds.forEach(o => {
            //         $(`#${o}`).css({ left: offsetX, top: offsetY })
            //     })
            // }, 100)
        }

        render() {
            let designer = this;
            let { pageData } = this.state
            pageData = this.convertHTMLTag(pageData)
            let pageView = pageData ? core.toReactElement(pageData) : null
            return <div className="designer" tabIndex={1}
                ref={e => {
                    if (!e) return
                    this.element = e || this.element
                    // this.mouseEvent()
                }}
                onKeyDown={(e) => this.onKeyDown(e)}>
                <DesignerContext.Provider value={{ designer }}>
                    {pageView}
                </DesignerContext.Provider>
            </div >;
        }
    }

    function designTimeCreateElement(type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]) {

        //====================================================
        // 将 props copy 出来，以便于可以修改
        props = Object.assign({}, props || {});
        //====================================================

        if (props.id != null)
            props.key = props.id;

        if (type == 'a' && (props as any).href) {
            (props as any).href = 'javascript:';
        }
        else if (type == 'input' || type == 'button') {
            delete props.onClick;
            (props as any).readOnly = true;
        }

        if (props.style) {
            let style = Object.assign({}, props.style)
            delete style.left
            delete style.top
            props.style = style
        }

        return core.originalCreateElement(type, props, ...children)
    }




}