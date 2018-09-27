/*******************************************************************************
 * Copyright (C) maishu All rights reserved.
 * 
 * 作者: 寒烟
 * 日期: 2018/5/30
 *
 * 个人博客：   http://www.cnblogs.com/ansiboy/
 * GITHUB:     http://github.com/ansiboy
 * QQ 讨论组：  119038574
 * 
 * core 文件用于运行时加载，所以要控制此文件的大小，用于在运行时创建页面
 * 
 ********************************************************************************/

namespace jueying {

    export type DesignerContextValue = { designer: PageDesigner | null };
    export const DesignerContext = React.createContext<DesignerContextValue>({ designer: null });

    export interface DesigntimeComponent {
        /** 运行时控件的类型名称 */
        typename: string
    }

    export function component<T extends React.Component>(args?: { container?: boolean, movable?: boolean }) {
        let defaultArguments: typeof args = { container: false, movable: true }
        args = Object.assign(defaultArguments, args || {})

        return function (constructor: { new(...args): T }) {
            // let c = constructor as any as React.ComponentClass<ControlProps<any>, any>
            if (PageDesigner) {
                return PageDesigner.createDesigntimeClass(constructor, args)
            }

            return constructor
        }
    }

    export let core = {
        originalCreateElement: React.createElement,
        toReactElement,
        customControlTypes: {} as { [key: string]: React.ComponentClass<any> | string },
        register,
        loadAllTypes,
        componentType(name: string) {
            let t = core.customControlTypes[name]
            // if (t == null)
            //     throw new Error(`Component ${name} is not exists`)

            return t
        }
    }



    /**
     * 将持久化的元素数据转换为 ReactElement
     * @param args 元素数据
     */
    function toReactElement(args: ComponentData, designer?: PageDesigner): React.ReactElement<any> | null {
        try {

            let type: string | React.ComponentClass = args.type;
            let componentName = args.type;
            let controlType = core.customControlTypes[componentName];
            if (controlType) {
                type = controlType;
            }

            let children = args.children ? args.children.map(o => this.toReactElement(o, designer)) : [];

            console.assert(args.props)
            let props = JSON.parse(JSON.stringify(args.props));
            // if (designer && typeof type == 'string') {
            //     let _ref = props.ref
            //     props.ref = (e: HTMLElement) => {
            //         if (!e) return
            //         if (typeof _ref == 'function')
            //             _ref.apply(this, [e])

            //         designer.designtimeBehavior(e, { container: true, movable: true })
            //     }
            // }
            let result = core.originalCreateElement<React.Props<any>>(type, props, ...children);
            // if (async) {
            //     let elementChildren: React.ReactElement<any>[] = null
            //     if (result.props.children) {
            //         elementChildren = (Array.isArray(result.props.children) ? result.props.children : [result.props.children]) as React.ReactElement<any>[]
            //     }
            //     let children: ElementData[] = []
            //     if (elementChildren)
            //         children = elementChildren.map(o => toElementData(o))

            //     children.forEach(o => {
            //         let notExists = args.children.filter(c => typeof c != 'string' && c.props.id == c.props.id).length == 0
            //         if (notExists) {
            //             args.children.push(o)
            //         }
            //     })
            // }

            return result
            //     }
            // );
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    function toElementData(element: React.ReactElement<React.Props<any>>): ComponentData {

        let elementChildren: React.ReactElement<any>[] = null
        if (element.props.children) {
            let arr = Array.isArray(element.props.children) ? element.props.children : [element.props.children]
            elementChildren = arr as React.ReactElement<any>[]
        }

        let children: ComponentData[] = null
        if (elementChildren)
            elementChildren.map(o => toElementData(o)).filter(o => o)

        let type = typeof element.type == 'function' ? componentNameByType(element.type) : null;
        if (!type)
            return null

        let props = {}
        for (let key in element.props) {
            if (key == 'children' || key == 'ref' || key == 'key')
                continue

            props[key] = element.props[key]
        }

        let data: ComponentData = children ? { type, children, props } : { type, props }
        return data
    }


    function register(controlName: string, controlType: React.ComponentClass<any>): void {
        if (controlType == null && typeof controlName == 'function') {
            controlType = controlName;
            controlName = (controlType as React.ComponentClass<any>).name;
            (controlType as any)['componentName'] = controlName;
        }

        if (!controlName)
            throw Errors.argumentNull('controlName');

        if (!controlType)
            throw Errors.argumentNull('controlType');

        core.customControlTypes[controlName] = controlType;
    }

    function loadAllTypes() {
        let ps = new Array<Promise<any>>();
        for (let key in core.customControlTypes) {
            if (typeof core.customControlTypes[key] == 'string') {
                ps.push(this.getControlType(key));
            }
        }

        return Promise.all(ps);
    }

    function componentNameByType(type: React.ComponentClass<any> | React.StatelessComponent<any>) {
        for (let key in core.customControlTypes) {
            if (core.customControlTypes[key] == type)
                return key;
        }

        return null;
    }

    interface HTMLTagProps extends React.Props<HTMLTag> {
        tagName?: string,
        style?: React.CSSProperties,
    }
    

    @(component({ container: true, movable: true }) as any)
    export class HTMLTag extends React.Component<HTMLTagProps, {}> {

        static defaultProps: HTMLTagProps = { tagName: 'div', style: { width: 50, height: 50 } }

        constructor(props) {
            super(props)
        }

        render() {
            let { tagName } = this.props
            let obj = {} as any
            for (let key in this.props) {
                let name = key as keyof HTMLTagProps
                if (name == 'tagName' || name == 'children')
                    continue

                obj[key] = this.props[key]
            }

            obj.className = 'html-tag'
            // obj.style = Object.assign({ width: 50, height: 50 }, obj.style || {})

            let children = []
            if (this.props.children) {
                if (Array.isArray(this.props.children))
                    children = this.props.children
                else
                    children = [this.props.children]
            }

            return React.createElement(tagName, obj, ...children)
        }
    }
}


