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

    // export let h = React.createElement

    export type DesignerContextValue = { designer: PageDesigner | null };
    export const DesignerContext = React.createContext<DesignerContextValue>({ designer: null });

    export interface DesigntimeComponent {
        /** 运行时控件的类型名称 */
        typename: string,
        designer: PageDesigner,
    }

    export function component<T extends React.Component>(args?: { container?: boolean, movable?: boolean }) {
        let defaultArguments: typeof args = { container: false, movable: true }
        args = Object.assign(defaultArguments, args || {})

        return function (constructor: { new(...args): T }) {
            let c = constructor as any as React.ComponentClass<ComponentProps<any>, any>
            // let result = class ComponetWraper extends c implements DesigntimeComponent {
            //     designer: PageDesigner;
            //     get typename(): string {
            //         return constructor.name
            //     }

            //     render() {
            //         return super.render()
            //     }
            // }

            core.register(constructor.name, constructor)
            return constructor
        }
    }

    export let core = {
        // originalCreateElement: React.createElement,
        createElement,
        componentTypes: {} as { [key: string]: React.ComponentClass<any> | string },
        register,
        loadAllTypes,
        componentType(name: string) {
            let t = core.componentTypes[name]
            return t
        }
    }

    type ReactFactory = (type: string | React.ComponentClass<any>, props: ComponentProps<any>, ...children: any[]) => JSX.Element

    /**
     * 将持久化的元素数据转换为 ReactElement
     * @param args 元素数据
     */
    function createElement(args: ComponentData, h?: ReactFactory): React.ReactElement<any> | null {

        h = h || React.createElement

        try {

            let type: string | React.ComponentClass = args.type;
            let componentName = args.type;
            let controlType = core.componentTypes[componentName];
            if (controlType) {
                type = controlType;
            }

            let children = args.children ? args.children.map(o => createElement(o, h)) : [];

            console.assert(args.props)
            let props = JSON.parse(JSON.stringify(args.props));
            let result = h(type, props, ...children);

            return result
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


    function register(componentName: string, componentType: React.ComponentClass<any>): void {
        if (componentType == null && typeof componentName == 'function') {
            componentType = componentName;
            componentName = (componentType as React.ComponentClass<any>).name;
            (componentType as any)['componentName'] = componentName;
        }

        if (!componentName)
            throw Errors.argumentNull('componentName');

        if (!componentType)
            throw Errors.argumentNull('componentType');

        core.componentTypes[componentName] = componentType;
    }

    function loadAllTypes() {
        let ps = new Array<Promise<any>>();
        for (let key in core.componentTypes) {
            if (typeof core.componentTypes[key] == 'string') {
                ps.push(this.getControlType(key));
            }
        }

        return Promise.all(ps);
    }

    function componentNameByType(type: React.ComponentClass<any> | React.StatelessComponent<any>) {
        for (let key in core.componentTypes) {
            if (core.componentTypes[key] == type)
                return key;
        }

        return null;
    }




}


