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
        onClick?: (e: MouseEvent) => void,
    }

    export class PageDesigner extends React.Component<PageDesignerProps, PageDesignerState> {
        private _selectedControlIds: string[] = [];
        private element: HTMLElement;

        controlSelected = Callback.create<string[]>();
        controlRemoved = Callback.create<string[]>()
        designtimeComponentDidMount = Callback.create<{ component: React.ReactElement<any>, element: HTMLElement }>();
        componentUpdated = Callback.create<PageDesigner>()
        names = new Array<string>();

        private static componentAttributes: { [key: string]: ComponentAttribute } = {
            'table': { container: false, movable: true },
            'thead': { container: false, movable: false },
            'tbody': { container: false, movable: false },
            'tfoot': { container: false, movable: false },
            'tr': { container: false, movable: false },
            'td': { container: true, movable: false },

            'img': { container: false, movable: true },

            'div': { container: true, movable: true },
        }
        private static defaultComponentAttribute: ComponentAttribute = { container: false, movable: true }

        constructor(props: PageDesignerProps) {
            super(props);

            this.initSelectedIds(props.pageData)
            this.state = { pageData: props.pageData };
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


        get pageData() {
            return this.state.pageData;
        }

        get selectedComponentIds() {
            return this._selectedControlIds
        }

        static setComponentAttribute(typename: string, attr: ComponentAttribute) {
            this.componentAttributes[typename] = attr
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
        static enableDroppable(element: HTMLElement, designer: PageDesigner) {
            // let element = this.element
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
        appendComponent(parentId: string, childControl: ComponentData, childIds?: string[]) {
            if (!parentId) throw Errors.argumentNull('parentId');
            if (!childControl) throw Errors.argumentNull('childControl');

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
            //====================================================
            // 设置焦点，以便获取键盘事件
            this.element.focus()
            //====================================================
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
            this.appendComponent(parentId, control, childIds);
        }

        private removeControlFrom(controlId: string, collection: ComponentData[]): boolean {
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
         * @param attr 
         */
        designtimeBehavior(element: HTMLElement, attr: { container?: boolean, movable?: boolean }) {
            if (!element) throw Errors.argumentNull('element')
            if (!attr) throw Errors.argumentNull('args')

            console.assert(attr.container != null)
            console.assert(attr.movable != null)
            if (attr.container) {
                PageDesigner.enableDroppable(element, this)
            }
            if (attr.movable) {
                console.assert(element != null)
                PageDesigner.draggableElement(element, this)
            }
        }

        private static draggableElement(element: HTMLElement, designer: PageDesigner) {
            if (!element) throw Errors.argumentNull('element')
            if (!element) throw Errors.argumentNull('designer')

            let timeStart: number
            let elementID = element.id
            console.assert(elementID)
            $(element)
                .drag("init", function (ev) {
                    let e = ev.currentTarget as HTMLElement
                    if ($(this).is(`.${classNames.componentSelected}`))
                        return $(`.${classNames.componentSelected}`);
                })
                .drag('start', function (ev) {
                    timeStart = Date.now()

                })
                .drag(function (ev, dd) {
                    ev.preventDefault()
                    ev.stopPropagation()

                    setPosition(ev, dd, this)

                }, { click: true })
                .drag('end', function (ev, dd) {
                    let designerPosition = $(designer.element).offset()
                    let left = dd.offsetX - designerPosition.left
                    let top = dd.offsetY - designerPosition.top
                    designer.setControlPosition(ev.currentTarget.id, left, top)
                })
                .click(function (ev, dd) {
                    ev.preventDefault()
                    ev.stopPropagation()

                    console.log(`draggableElement drag end: ${timeStart}`)
                    let t = Date.now() - (timeStart || Date.now())
                    timeStart = null
                    if (t > 300) {
                        return
                    }
                    console.log(`time interval:` + t)

                    let e = ev.currentTarget as HTMLElement
                    let element = ev.currentTarget as HTMLElement
                    let elementID = element.id
                    if (!ev.ctrlKey) {
                        designer.selectComponent(element.id)
                        return
                    }

                    console.assert(elementID)
                    if (designer._selectedControlIds.indexOf(elementID) >= 0) {
                        designer._selectedControlIds = designer._selectedControlIds.filter(o => o != elementID)
                    }
                    else {
                        designer._selectedControlIds.push(elementID)
                    }
                    designer.selectComponent(designer._selectedControlIds)
                })



            function setPosition(ev: JQuery.Event<any>, dd, element: any) {
                let designerPosition = $(designer.element).offset()
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

        createDesignTimeElement(type: string | React.ComponentClass<any>, props: ComponentProps<any>, ...children: any[]) {

            console.assert(props.id)
            if (props.id != null)
                props.key = props.id;

            if (type == 'a' && (props as any).href) {
                (props as any).href = 'javascript:';
            }
            else if (type == 'input' || type == 'button') {
                delete (props as any).onClick;
                (props as any).readOnly = true;
            }

            let allowWrapper: boolean = true
            let tagName: keyof HTMLElementTagNameMap = type as keyof HTMLElementTagNameMap
            if (tagName == 'html' || tagName == 'head' || tagName == 'body' ||
                tagName == 'thead' || tagName == 'tbody' || tagName == 'tfoot' || tagName == 'th' || tagName == 'tr' || tagName == 'td') {
                allowWrapper = false
            }

            if (allowWrapper) {

                let style = props.style || {}
                let { top, left, position, width, height } = style

                delete style.left
                delete style.top

                let wrapperProps: ComponentProps<any> & React.HTMLAttributes<any> = {
                    id: props.id,
                    className: props.selected ? `${classNames.componentSelected} ${classNames.component}` : classNames.component,
                    style: { top, left, position, width, height },
                    ref: (e: HTMLElement) => {
                        if (!e) return
                        if (e.getAttribute('data-behavior')) {
                            return
                        }
                        e.setAttribute('data-behavior', 'behavior')
                        let typename = typeof type == 'string' ? type : type.name
                        let attr = Object.assign(PageDesigner.defaultComponentAttribute, PageDesigner.componentAttributes[typename] || {})
                        this.designtimeBehavior(e, attr)
                    }
                }

                return <div {...wrapperProps}>
                    <div style={{ height: 12, width: 12, top: -6, left: 8, border: 'solid 1px black', position: 'absolute' }} />
                    {React.createElement(type, props, ...children)}
                </div>
            }

            props.ref = (e: HTMLElement) => {
                if (!e) return
                e.onclick = (ev) => {
                    ev.stopPropagation()
                    this.selectComponent(e.id)
                }
            }

            let element = React.createElement(type, props, ...children)
            return element
        }

        componentWillReceiveProps(props: PageDesignerProps) {
            this.initSelectedIds(props.pageData)
            this.setState({ pageData: props.pageData });
        }

        componentDidUpdate() {
            this.componentUpdated.fire(this)
        }

        render() {
            let designer = this;
            let { pageData } = this.state

            let result = <div className="designer" tabIndex={1}
                ref={e => {
                    if (!e) return
                    this.element = e || this.element
                }}
                onKeyDown={(e) => this.onKeyDown(e)}>
                <DesignerContext.Provider value={{ designer }}>
                    {(() => {
                        let pageView = pageData ? core.createElement(pageData, this.createDesignTimeElement.bind(this)) : null
                        return pageView
                    })()}
                </DesignerContext.Provider>
            </div >

            return result
        }
    }
}