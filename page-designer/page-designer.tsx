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

        private selectedControlId: string | null = null;
        element: HTMLElement;

        controlSelected = Callback.create<Control<ControlProps<any>, any> | null>();
        controlComponentDidMount = Callback.create<Control<any, any>>();

        constructor(props: PageDesignerProps) {
            super(props);

            this.state = { pageData: this.props.pageData };
        }

        componentWillReceiveProps(props: PageDesignerProps) {
            this.setState({ pageData: props.pageData });
        }

        get pageData() {
            return this.state.pageData;
        }
        set pageData(value: ElementData | null) {
            if (!value) throw Errors.argumentNull('value')

            this.setState({ pageData: value });
        }

        updateControlProps(controlId: string, props: any): any {
            let controlDescription = this.findControlData(controlId);
            if (controlDescription == null)
                return

            console.assert(controlDescription != null);
            console.assert(props != null, 'props is null');

            controlDescription.props = controlDescription.props || {};
            for (let key in props) {
                controlDescription.props[key] = props[key];
            }

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
            this.selectControl(control);
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

        selectControlById(controlId: string) {
            let control = Control.getInstance(controlId);
            this.selectControl(control);
        }

        /**
         * 选择指定的控件
         * @param control 指定的控件，可以为空，为空表示清空选择。
         */
        selectControl(control: Control<any, any>): void {
            if (!control) throw Errors.argumentNull('control');

            this.controlSelected.fire(control)
            let selectedControlId1 = control ? control.id : null;
            this.selectedControlId = selectedControlId1;

            if (!control.hasEditor) {
                console.log(`Control ${control.constructor.name} has none editor.`);
                return;
            }

            if (control.element == null)
                throw new Error('Control element is null')

            $(`.${classNames.controlSelected}`).removeClass(classNames.controlSelected);
            $(control.element).addClass(classNames.controlSelected);

            if (selectedControlId1) {
                setTimeout(() => {
                    $(`#${selectedControlId1}`).focus();
                    console.log(`focuse ${selectedControlId1} element`);
                }, 100);
            }
        }

        /** 清除已经选择的控件 */
        clearSelectControl() {

            $(`.${classNames.controlSelected}`).removeClass(classNames.controlSelected);
            this.selectedControlId = null;
            this.controlSelected.fire(null);
        }

        /** 移除控件 */
        removeControl(controlId: string) {
            let pageData = this.state.pageData;
            if (!pageData || !pageData.children || pageData.children.length == 0)
                return;

            let isRemoved = this.removeControlFrom(controlId, pageData.children);
            if (isRemoved) {
                this.setState({ pageData });
            }
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
                let selectedControlId = this.selectedControlId
                let element = selectedControlId ? this.findControlData(selectedControlId) : null;
                if (element == null) {
                    return;
                }

                console.assert(element.props.id);
                this.removeControl(element.props.id);
            }
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