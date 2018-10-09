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
        private element: HTMLElement;

        componentSelected = Callback.create<string[]>();
        componentRemoved = Callback.create<string[]>()
        componentAppend = Callback.create<PageDesigner>()
        componentUpdated = Callback.create<ComponentData[]>()

        designtimeComponentDidMount = Callback.create<{ component: React.ReactElement<any>, element: HTMLElement }>();
        namedComponents: { [key: string]: ComponentData } = {}

        constructor(props: PageDesignerProps) {
            super(props);

            this.initPageData(props.pageData)
            this.state = { pageData: props.pageData };
            this.designtimeComponentDidMount.add((args) => {
                console.log(`this:designer event:controlComponentDidMount`)
            })
        }

        initPageData(pageData: ComponentData) {
            if (pageData == null) {
                return
            }
            this.nameComponent(pageData)
        }


        get pageData() {
            return this.state.pageData;
        }

        get selectedComponentIds() {
            return this.selectedComponents.map(o => o.props.id)
        }

        get selectedComponents(): ComponentData[] {
            let arr = new Array<ComponentData>()
            let stack = new Array<ComponentData>()
            stack.push(this.pageData)
            while (stack.length > 0) {
                let item = stack.pop()
                if (item.props.selected == true)
                    arr.push(item)

                let children = item.children || []
                for (let i = 0; i < children.length; i++)
                    stack.push(children[i])
            }

            return arr
        }

        updateControlProps(controlId: string, navPropsNames: string[], value: any): any {
            let componentData = this.findComponentData(controlId);
            if (componentData == null)
                return

            console.assert(componentData != null);
            console.assert(navPropsNames != null, 'props is null');

            componentData.props = componentData.props || {};

            let obj = componentData.props
            for (let i = 0; i < navPropsNames.length - 1; i++) {
                obj = obj[navPropsNames[i]] = obj[navPropsNames[i]] || {};
            }

            obj[navPropsNames[navPropsNames.length - 1]] = value
            this.setState(this.state);
            this.componentUpdated.fire([componentData])
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

        /**
         * 对组件及其子控件进行命名
         * @param component 
         */
        private nameComponent(component: ComponentData) {
            let props = component.props = component.props || {};
            if (!props.name) {
                let num = 0;
                let name: string;
                do {
                    num = num + 1;
                    name = `${component.type}${num}`;
                } while (this.namedComponents[name]);

                this.namedComponents[name] = component
                props.name = name;
            }

            if (!props.id)
                props.id = guid();

            if (!component.children || component.children.length == 0) {
                return;
            }
            for (let i = 0; i < component.children.length; i++) {
                this.nameComponent(component.children[i]);
            }
        }

        /** 添加控件 */
        appendComponent(parentId: string, childControl: ComponentData, childIds?: string[]) {
            if (!parentId) throw Errors.argumentNull('parentId');
            if (!childControl) throw Errors.argumentNull('childControl');

            this.nameComponent(childControl)
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
            this.componentAppend.fire(this)
        }

        /** 设置控件位置 */
        setComponentPosition(componentId: string, position: { left: number | string, top: number | string }) {
            return this.setComponentsPosition([{ componentId, position }])
        }

        setComponentSize(componentId: string, size: { width?: number | string, height?: number | string }) {
            console.assert(componentId)
            console.assert(size)

            let componentData = this.findComponentData(componentId);
            if (!componentData)
                throw new Error(`Control ${componentId} is not exits.`);

            let style = componentData.props.style = (componentData.props.style || {});
            if (size.height)
                style.height = size.height

            if (size.width)
                style.width = size.width

            let { pageData } = this.state;
            this.setState({ pageData });

            this.componentUpdated.fire([componentData])
        }

        setComponentsPosition(positions: { componentId: string, position: { left: number | string, top: number | string } }[]) {
            let componentDatas = new Array<ComponentData>()
            positions.forEach(o => {
                let { componentId } = o
                let { left, top } = o.position
                let componentData = this.findComponentData(componentId);
                if (!componentData)
                    throw new Error(`Control ${componentId} is not exits.`);

                let style = componentData.props.style = (componentData.props.style || {});
                if (left)
                    style.left = left;

                if (top)
                    style.top = top;

                let { pageData } = this.state;
                this.setState({ pageData });
                componentDatas.push(componentData)
            })

            this.componentUpdated.fire(componentDatas)
        }

        /**
         * 选择指定的控件
         * @param control 指定的控件
         */
        selectComponent(componentIds: string[] | string): void {

            if (typeof componentIds == 'string')
                componentIds = [componentIds]

            var stack: ComponentData[] = []
            stack.push(this.pageData)
            while (stack.length > 0) {
                let item = stack.pop()
                let isSelectedControl = componentIds.indexOf(item.props.id) >= 0
                this.setComponentSelected(item, isSelectedControl)

                let children = item.children || []
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i])
                }
            }

            // this._selectedComponentIds = componentIds
            componentIds.map(id => this.findComponentData(id)).forEach(o => {
                console.assert(o != null)
                // let props = o.props as ComponentProps<any>
                // props.selected = true
                // let arr = (props.className || '').split(' ').filter(O => o) //= (props.className || '') + ' ' + classNames.componentSelected
                // if (props.selected)
                this.setComponentSelected(o, true)
            })
            this.setState({ pageData: this.pageData })
            this.componentSelected.fire(this.selectedComponentIds)
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

            // this._selectedComponentIds = this._selectedComponentIds.filter(id => controlIds.indexOf(id) < 0)
            this.setState({ pageData });

            this.componentRemoved.fire(controlIds)
        }

        /** 移动控件到另外一个控件容器 */
        moveControl(componentId: string, parentId: string, childIds: string[]) {
            let control = this.findComponentData(componentId);
            if (control == null)
                throw new Error(`Cannt find control by id ${componentId}`)

            console.assert(control != null, `Cannt find control by id ${componentId}`);

            let pageData = this.state.pageData;
            console.assert(pageData.children);
            this.removeControlFrom(componentId, pageData.children);
            this.appendComponent(parentId, control, childIds);
        }

        private setComponentSelected(component: ComponentData, value: boolean) {
            component.props.selected = value
            component.props.className = component.props.className || ''
            let arr = component.props.className.split(' ') || []
            arr = arr.filter(a => a != '' && a != classNames.componentSelected)
            if (value == true) {
                arr.push(classNames.componentSelected)
            }

            component.props.className = arr.join(' ').trim()
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
                if (this.selectedComponents.length == 0)
                    return

                this.removeControl(...this.selectedComponentIds)
            }
        }

        private createDesignTimeElement(type: string | React.ComponentClass<any>, props: ComponentProps<any>, ...children: any[]) {

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

                let style = Object.assign({}, props.style || {})
                delete props.style.left
                delete props.style.top
                delete props.style.position
                props.style.width = '100%'
                props.style.height = '100%'

                return <ComponentWrapper {...props} type={type} designer={this} style={style}>
                    {React.createElement(type, props, ...children)}
                </ComponentWrapper>
            }

            props.ref = (e: HTMLElement | React.Component) => {
                if (!e) return

                if ((e as HTMLElement).tagName) {
                    (e as HTMLElement).onclick = (ev) => {
                        ComponentWrapper.invokeOnClick(ev, this, e as HTMLElement)
                    }

                    let typename = typeof type == 'string' ? type : type.name
                    let attr = Component.getAttribute(typename)
                    if (attr != null && attr.container) {
                        ComponentWrapper.enableDroppable(e as HTMLElement, this)
                    }

                    return
                }

                throw new Error('not implement')
            }

            let element = React.createElement(type, props, ...children)
            return element
        }

        componentWillReceiveProps(props: PageDesignerProps) {
            this.initPageData(props.pageData)
            this.setState({ pageData: props.pageData });
        }

        // componentDidUpdate() {
        //     this.componentUpdated.fire(this)
        // }

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