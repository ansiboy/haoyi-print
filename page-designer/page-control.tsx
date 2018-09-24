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
    let h = React.createElement;

    export interface ControlProps<T> extends React.Props<T> {
        id?: string,
        name?: string,
        className?: string,
        style?: React.CSSProperties,
        tabIndex?: number,
        componentName?: string,
        designMode?: boolean,
        selected?: boolean,
    }

    export interface ControlState {
        selected: boolean
    }

    let customControlTypes: { [key: string]: React.ComponentClass<any> | string } = {}

    export abstract class Control<P extends ControlProps<any>, S> extends React.Component<P, S> {
        private _designer: PageDesigner | null = null;
        private originalComponentDidMount: (() => void) | undefined;
        private originalRender: () => React.ReactNode;
        // private static allInstance: { [key: string]: Control<any, any> } = {};

        static tabIndex = 1;

        static componentsDir = 'components';
        static connectorElementClassName = 'control-container';
        static controlTypeName = 'data-control-name';

        protected hasCSS = false;

        // pageView: PageView
        element: HTMLElement;

        constructor(props: P) {
            super(props);

            console.assert((this.props as any).id != null);
            this.originalComponentDidMount = this.componentDidMount;
            this.componentDidMount = this.myComponentDidMount;

            console.assert(this.props.id, 'id is null or empty')
        }

        get id(): string {
            let id = (this.props as any).id;
            console.assert(id);
            return id;
        }

        get isDesignMode(): boolean {
            if (this.props.designMode == null)
                return this.designer != null;

            return this.props.designMode as boolean;
        }

        get componentName() {
            var componentName = (this.constructor as any)['componentName'];
            console.assert(componentName != null)
            return componentName;
        }

        get designer() {
            return this._designer;
        }

        static htmlDOMProps(props: any) {
            let result: { [key: string]: any } = {};
            if (!props) {
                return result;
            }
            let keys = ['id', 'style', 'className', 'onClick'];
            for (let key in props) {
                if (keys.indexOf(key) >= 0) {
                    result[key] = props[key];
                }
            }
            return result;
        }

        protected async loadControlCSS() {
            let componentName = this.componentName;
            console.assert(componentName != null);
            let path = `${Control.componentsDir}/${componentName}/control`;
            requirejs([`less!${path}`])
        }

        private myComponentDidMount() {
            if (this.originalComponentDidMount)
                this.originalComponentDidMount();

            if (this.hasCSS) {
                this.loadControlCSS();
            }
        }

        // Element(child: React.ReactElement<any>): React.ReactElement<any> | null
        // Element(props: any, element: React.ReactElement<any>): React.ReactElement<any> | null
        // Element(type: string, ...children: React.ReactElement<any>[]): React.ReactElement<any> | null
        // Element(type: string, props: ControlProps<this>, ...children: React.ReactElement<any>[]): React.ReactElement<any> | null
        // Element(type: any, props?: any, ...children: any[]): React.ReactElement<any> | null {
        //     if (typeof type == 'string' && typeof (props) == 'object' && !React.isValidElement(props)) {
        //     }
        //     else if (typeof type == 'string' && (props == null || typeof (props) == 'object' && React.isValidElement(props) ||
        //         typeof (props) == 'string')) {
        //         children = children || [];
        //         if (props)
        //             children.unshift(props);

        //         props = {};
        //         if (children.length == 0)
        //             children = null as any;
        //     }
        //     else if (typeof type == 'object' && React.isValidElement(type) && props == null) {
        //         children = [type];
        //         type = 'div';
        //         props = {};
        //     }
        //     else if (typeof type == 'object' && !React.isValidElement(type) && React.isValidElement(props)) {
        //         children = [props];
        //         props = type;
        //         type = 'div';
        //     }
        //     else {
        //         throw new Error('not implement');
        //     }

        //     if (this.props.id)
        //         props.id = this.props.id;

        //     if (this.props.style) {
        //         props.style = props.style ? Object.assign(this.props.style, props.style || {}) : this.props.style;
        //     }

        //     let className = ''
        //     if (this.props.className) {
        //         className = this.props.className
        //     }

        //     if (this.props.selected) {
        //         className = className + ' ' + classNames.controlSelected
        //     }

        //     if (className)
        //         props.className = className;

        //     if (this.props.tabIndex)
        //         props.tabIndex = this.props.tabIndex;
        //     else
        //         props.tabIndex = Control.tabIndex++

        //     if (this.isDesignMode && typeof type == 'string') {
        //         let func = (e: React.MouseEvent<any>) => {
        //             console.log(`event type:${event.type}`)
        //             let selectedControlIds = this.designer.selectedControlIds //[this.id]

        //             //========================================================================
        //             // 如果是多个 click 事件选中
        //             if (selectedControlIds.length > 1 && event.type == 'react-mousedown') {
        //                 return
        //             }
        //             //========================================================================

        //             if (e.ctrlKey) {
        //                 if (selectedControlIds.indexOf(this.id) >= 0) {
        //                     selectedControlIds = selectedControlIds.filter(o => o != this.id)
        //                 }
        //                 else {
        //                     selectedControlIds.push(this.id)
        //                 }
        //             }
        //             else {
        //                 selectedControlIds = [this.id]
        //             }

        //             console.assert(this.designer != null)
        //             this.designer.selectControl(selectedControlIds)

        //             e.stopPropagation();
        //         }

        //         (props as React.DOMAttributes<any>).onMouseDown = func;
        //         (props as React.DOMAttributes<any>).onClick = func;
        //     }

        //     let originalRef = props.ref;
        //     props.ref = (e: any) => {
        //         if (originalRef) {
        //             originalRef(e);
        //         }

        //         if (e == null)
        //             return

        //         this.element = e

        //     };

        //     return ControlFactory.createElement(this, type, props, ...children);
        // }


        // private static render() {
        //     let self = this as any as Control<any, any>;
        //     return <DesignerContext.Consumer>
        //         {
        //             context => {
        //                 self._designer = context.designer;

        //                 return <PageViewContext.Consumer>
        //                     {pageViewContext => {

        //                         self.pageView = pageViewContext.pageView
        //                         if (typeof self.originalRender != 'function')
        //                             return null;
        //                         let h = (type: string | React.ComponentClass<any>, props: ControlProps<any>, ...children: any[]) =>
        //                             ControlFactory.createElement(self, type, props, ...children);

        //                         return (self.originalRender as Function)(h)

        //                     }}
        //                 </PageViewContext.Consumer>
        //             }
        //         }
        //     </DesignerContext.Consumer >
        // }

        private static getControlType(componentName: string): Promise<React.ComponentClass<any>> {
            return new Promise<React.ComponentClass<any>>((resolve, reject) => {
                let controlType = customControlTypes[componentName];
                if (typeof controlType != 'string') {
                    resolve(controlType);
                    return;
                }

                let controlPath = controlType;
                requirejs([controlPath],
                    (exports2: any) => {
                        let controlType: React.ComponentClass = exports2['default'];
                        if (controlType == null)
                            throw new Error(`Default export of file '${controlPath}' is null.`);

                        (controlType as any)['componentName'] = componentName;
                        customControlTypes[componentName] = controlType;
                        resolve(controlType);
                    },
                    (err: Error) => reject(err)
                )
            })
        }

        static loadTypes(elementData: ElementData) {
            if (!elementData) throw Errors.argumentNull('elementData');
            let stack = new Array<ElementData>();
            stack.push(elementData);
            let ps = new Array<Promise<any>>();
            while (stack.length > 0) {
                let item = stack.pop();
                if (item == null)
                    continue

                let componentName = item.type;
                ps.push(this.getControlType(componentName));

                let children = item.children || [];
                for (let i = 0; i < children.length; i++)
                    stack.push(children[i]);
            }

            return Promise.all(ps);
        }


        // static getInstance(id: string) {
        //     if (!id) throw Errors.argumentNull('id');

        //     return this.allInstance[id];
        // }

        // static addInstance(id: string, instance: React.Component) {
        //     this.allInstance[id] = instance as any
        // }

        // static create(args: ElementData): React.ReactElement<any> | null {
        //     return ControlFactory.toReactElement(args);
        // }

    }






}