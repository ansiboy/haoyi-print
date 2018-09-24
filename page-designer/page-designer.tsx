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
        pageData: ElementData | null,
    }

    export interface PageDesignerState {
        pageData: ElementData | null
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

            this.state = { pageData: props.pageData };
            this.initSelectedIds(props.pageData)
            this.designtimeComponentDidMount.add((args) => {
                console.log(`this:designer event:controlComponentDidMount`)
                // PageDesigner.draggableElement(args.element, this)
            })
        }

        initSelectedIds(pageData: ElementData) {
            if (pageData == null) {
                this._selectedControlIds = []
                return
            }
            let stack = new Array<ElementData>()
            stack.push(pageData)
            while (stack.length > 0) {
                let item = stack.pop()
                let props = item.props as ControlProps<any>
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
            this.setState({ pageData: props.pageData });
            this.initSelectedIds(props.pageData)
        }

        componentDidUpdate() {
            this.componentUpdated.fire(this)
        }


        get pageData() {
            return this.state.pageData;
        }
        set pageData(value: ElementData | null) {
            if (!value) throw Errors.argumentNull('value')

            this.setState({ pageData: value });
        }

        get selectedControlIds() {
            return this._selectedControlIds
        }

        updateControlProps(controlId: string, navPropsNames: string[], value: any): any {
            let controlDescription = this.findControlData(controlId);
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

                let componentName = event.dataTransfer.getData(Control.controlTypeName)
                if (componentName)
                    event.dataTransfer.dropEffect = "copy"
                else
                    event.dataTransfer.dropEffect = "move"

                console.log(`dragover: left:${event.layerX} top:${event.layerX}`)
            })
            element.ondrop = (event) => {
                event.preventDefault()
                event.stopPropagation()

                let componentName = event.dataTransfer.getData(Control.controlTypeName)
                if (!componentName) {
                    return
                }


                let defaultStyle = {}
                let componentType = core.componentType(componentName)
                if (componentType != null && typeof componentType != 'string' && componentType.defaultProps != null) {
                    defaultStyle = componentType.defaultProps.style || {}
                }

                let left = event.layerX;
                let top = event.layerY;
                let ctrl: ElementData = {
                    type: componentName,
                    props: {
                        id: guid(),
                        style: Object.assign(defaultStyle, {
                            position: 'absolute', //TODO: 不要写死
                            left,
                            top,
                        } as React.CSSProperties)
                    }
                };

                designer.appendControl(element.id, ctrl);
            }
        }

        findContainerControlId(element: HTMLElement): ElementData {
            if (element.id) {
                let controlData = this.findControlData(element.id)
                if (controlData != null)
                    return controlData
            }

            let parent = element.parentElement
            if (parent != null && parent != this.element) {
                return this.findContainerControlId(parent)
            }

            return null
        }

        //======================================================================================
        // 事件
        mouseEvent() {

            let dragExecuted: boolean
            //=====================================================
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

                startPositions = this.selectedControlIds
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
                if (deltaX < MIN_DELTA && deltaY < MIN_DELTA)
                    return

            })

            //=====================================================
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
            //=====================================================

            this.element.addEventListener('mouseup', (ev: MouseEvent) => {
                if (isDragOperation == false || ev.shiftKey || ev.ctrlKey || ev.metaKey) {
                    return
                }

                if (deltaX >= MIN_DELTA || deltaY >= MIN_DELTA) {
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
                }

                // init data
                isDragOperation = false
                x = y = deltaX = deltaY = null
                startPositions = []
            })
            //=====================================================


            this.element.onclick = (e: MouseEvent) => {
                if (dragExecuted) {
                    dragExecuted = false
                    return
                }

                let target = e.target as HTMLElement
                let controlData = this.findContainerControlId(target)
                console.assert(controlData != null)
                console.log(`designer event:${e.type} target:${target.tagName}`)

                let controlId = controlData.props.id
                let selectedControlIds = this.selectedControlIds //[this.id]
                if (!selectedControlIds)
                    return

                //========================================================================
                // 如果是多个 click 事件选中
                // if (selectedControlIds.length > 1 && event.type != 'click') {
                //     return
                // }
                // else(selectedControlIds.length<=1&&event.type) {

                // }
                //========================================================================

                if (e.ctrlKey) {
                    if (selectedControlIds.indexOf(controlId) >= 0) {
                        selectedControlIds = selectedControlIds.filter(o => o != controlId)
                    }
                    else {
                        selectedControlIds.push(controlId)
                    }
                }
                else {
                    selectedControlIds = [controlId]
                }

                console.assert(this != null)
                this.selectControl(selectedControlIds)

            }
        }
        //======================================================================================


        /**
         * 允许拖动指定的元素的子元素，移到子元素
         * @param element 指定元素
         * @param designer 指定元素所在设计器
         */
        draggableControl(controlId: string) {//, container: HTMLElement
            this.draggableElementIds.push(controlId)
        }

        sortControlChildren(controlId: string, childIds: string[]): void {
            let c = this.findControlData(controlId)
            if (c == null)
                return

            let children = c.children || []
            c.children = childIds.map(o => children.filter(a => a.props.id == o)[0]).filter(o => o != null);

            let { pageData } = this.state;
            this.setState({ pageData });
        }

        sortChildren(parentId: string, childIds: string[]) {
            if (!parentId) throw Errors.argumentNull('parentId');
            if (!childIds) throw Errors.argumentNull('childIds');

            let pageData = this.state.pageData;
            let parentControl = this.findControlData(parentId);
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

        private namedControl(control: jueying.ElementData) {
            let props = control.props;
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
        appendControl(parentId: string, childControl: ElementData, childIds?: string[]) {
            if (!parentId) throw Errors.argumentNull('parentId');
            if (!childControl) throw Errors.argumentNull('childControl');

            let parentControl = this.findControlData(parentId);
            if (parentControl == null)
                throw new Error('Parent is not exists')

            console.assert(parentControl != null);
            parentControl.children = parentControl.children || [];
            parentControl.children.push(childControl);

            this.namedControl(childControl)

            if (childIds)
                this.sortChildren(parentId, childIds);
            else {
                let { pageData } = this.state;
                this.setState({ pageData });
            }

            this.selectControl(childControl.props.id);

        }

        /** 设置控件位置 */
        setControlPosition(controlId: string, left: number | string, top: number | string) {
            let controlData = this.findControlData(controlId);
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
                let controlData = this.findControlData(controlId);
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
        selectControl(controlIds: string[] | string): void {

            if (typeof controlIds == 'string')
                controlIds = [controlIds]


            var stack: ElementData[] = []
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
            controlIds.map(id => this.findControlData(id)).forEach(o => {
                let props = o.props as ControlProps<any>
                props.selected = true
            })
            this.setState({ pageData: this.pageData })
            this.controlSelected.fire(this.selectedControlIds)
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
            let control = this.findControlData(controlId);
            if (control == null)
                throw new Error(`Cannt find control by id ${controlId}`)

            console.assert(control != null, `Cannt find control by id ${controlId}`);

            let pageData = this.state.pageData;
            console.assert(pageData.children);
            this.removeControlFrom(controlId, pageData.children);
            this.appendControl(parentId, control, childIds);
        }

        private removeControlFrom(controlId: string, collection: ElementData[]): boolean {
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

        findControlData(controlId: string): ElementData | null {
            let pageData = this.state.pageData;
            if (!pageData)
                throw Errors.pageDataIsNull();

            let stack = new Array<ElementData>();
            stack.push(pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                if (item == null)
                    continue

                if (item.props.id == controlId)
                    return item;

                stack.push(...(item.children || []));
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

        componentDidMount() {
            this.mouseEvent()
        }

        render() {
            let designer = this;
            let { pageData } = this.state
            let asyncPageData = true
            let pageView = pageData ? core.toReactElement(pageData, asyncPageData) : null
            return <div className="designer" tabIndex={1} ref={e => this.element = e || this.element}
                onKeyDown={(e) => this.onKeyDown(e)}>
                <DesignerContext.Provider value={{ designer }}>
                    {pageView}
                </DesignerContext.Provider>
            </div >;
        }
    }


}