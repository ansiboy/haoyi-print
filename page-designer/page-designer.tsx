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
        // controlUnselected = Callback.create<Control<ControlProps<any>, any>[]>();
        controlRemoved = Callback.create<string[]>()
        controlComponentDidMount = Callback.create<Control<any, any>>();

        constructor(props: PageDesignerProps) {
            super(props);

            this.state = { pageData: props.pageData };
            this.setControlPropEditor();

            this.initSelectedIds(props.pageData)

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

            if (childIds)
                this.sortChildren(parentId, childIds);
            else {
                let { pageData } = this.state;
                this.setState({ pageData });
            }
            let control = Control.getInstance(childControl.props.id);
            console.assert(control != null);
            this.selectControl(control.id);
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

            this._selectedControlIds
                .map(o => this.findControlData(o))
                .filter(o => o)
                .forEach(o => {
                    (o.props as ControlProps<any>).selected = false
                })

            this._selectedControlIds = controlIds
            controlIds.map(id => this.findControlData(id)).forEach(o => {
                let props = o.props as ControlProps<any>
                props.selected = true
            })
            this.setState({ pageData: this.pageData })
            this.controlSelected.fire(this.selectedControlIds)
        }



        // /**
        //  * 取消选择
        //  * @param control 指定的控件
        //  */
        // unselectControl(...controls: Control<any, any>[]) {
        //     if (!controls) throw Errors.argumentNull('controls');

        //     controls.forEach(control => {
        //         $(control.element).removeClass(classNames.controlSelected);
        //         this._selectedControlIds = this._selectedControlIds.filter(o => o != control.id)
        //     })

        //     this.controlUnselected.fire(controls)
        //     console.log(this._selectedControlIds)
        // }

        // /** 清除已经选择的控件 */
        // clearSelectdControls() {
        //     let selectControls = this._selectedControlIds.map(id => Control.getInstance(id))
        //     selectControls.forEach(o => this.unselectControl(o))
        //     this._selectedControlIds = [];
        // }

        /** 移除控件 */
        removeControl(...controlIds: string[]) {
            let pageData = this.state.pageData;
            if (!pageData || !pageData.children || pageData.children.length == 0)
                return;


            controlIds.forEach(controlId => {
                this.removeControlFrom(controlId, pageData.children);
            })

            this._selectedControlIds = this._selectedControlIds.filter(id => controlIds.indexOf(id) >= 0)
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

        protected findControlData(controlId: string): ElementData | null {
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

        setControlPropEditor() {
            ControlPropEditors.setControlPropEditor<PageViewProps, "name">(PageView, "名称", TextInput, "name")

            let items = {
                flowing: '流式定位',
                absolute: '绝对定位'
            }
            ControlPropEditors.setControlPropEditor<PageViewProps, "layout">(PageView, "布局", dropdown(items), "layout")
            ControlPropEditors.setControlPropEditor<ControlPlaceholderProps, "name">(ControlPlaceholder, "名称", TextInput, "name")
        }

        render() {
            let designer = this;
            return <div className="designer" tabIndex={1} ref={e => this.element = e || this.element}
                onKeyDown={(e) => this.onKeyDown(e)}>
                <DesignerContext.Provider value={{ designer }}>
                    {this.props.children}
                </DesignerContext.Provider>
            </div >;
        }
    }

    export type DesignerContextValue = { designer: PageDesigner | null };
    let value: DesignerContextValue = { designer: null };
    export const DesignerContext = React.createContext(value);
}