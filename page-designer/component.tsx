
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
 * component.tsx 文件用于运行时加载，所以要控制此文件的大小，用于在运行时创建页面
 * 
 ********************************************************************************/

namespace jueying {

    type ReactFactory = (type: string | React.ComponentClass<any>, props: ComponentProps<any>, ...children: any[]) => JSX.Element

    export type DesignerContextValue = { designer: PageDesigner | null };
    export const DesignerContext = React.createContext<DesignerContextValue>({ designer: null });

    export interface PropEditorInfo {
        propNames: string[],
        editorType: PropEditorConstructor, group: string
    }

    export function component<T extends React.Component>(args?: ComponentAttribute) {
        return function (constructor: { new(...args): T }) {
            if (PageDesigner) {
                Component.setAttribute(constructor.name, args)
            }

            Component.register(constructor.name, constructor)
            return constructor
        }
    }

    export class Component {
        private static defaultComponentAttribute: ComponentAttribute = {
            container: false, movable: false, showHandler: false, resize: false
        }

        private static componentAttributes: { [key: string]: ComponentAttribute } = {
            'table': { container: false, movable: true, showHandler: true, resize: true },
            'thead': { container: false, movable: false },
            'tbody': { container: false, movable: false },
            'tfoot': { container: false, movable: false },
            'tr': { container: false, movable: false },
            'td': { container: true, movable: false },

            'ul': { container: false, movable: true, showHandler: true, resize: false },
            'li': { container: true, movable: false, },

            'img': { container: false, movable: true, resize: true },

            'div': { container: true, movable: true, showHandler: true, resize: true },
        }

        /**
         * 设置组件特性
         * @param typename 组件类型名称
         * @param attr 组件特性
         */
        static setAttribute(typename: string, attr: ComponentAttribute) {
            Component.componentAttributes[typename] = attr
        }

        /**
         * 获取组件特性
         * @param typename 组件类型名称
         */
        // static getAttribute(typename: string)
        static getAttribute(type: string | React.ComponentClass<any>) {
            let typename = typeof type == 'string' ? type : type.name
            let attr = Component.componentAttributes[typename]
            return Object.assign({}, Component.defaultComponentAttribute, attr || {})
        }

        private static controlPropEditors: {
            [controlClassName: string]: PropEditorInfo[]
        } = {}

        static getPropEditors(controlClassName: string): PropEditorInfo[] {
            let classEditors = this.controlPropEditors[controlClassName] || []
            return classEditors
        }

        static getPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClassName: string, propName: K, propName1: K1): PropEditorInfo
        static getPropEditor<T, K extends keyof T>(controlClassName: string, propName: string): PropEditorInfo
        static getPropEditor(controlClassName: string, ...propNames: string[]): PropEditorInfo {
            return this.getPropEditorByArray(controlClassName, propNames)
        }

        /** 通过属性数组获取属性的编辑器 */
        static getPropEditorByArray(controlClassName: string, propNames: string[]) {
            let classEditors = this.controlPropEditors[controlClassName] || []
            let editor = classEditors.filter(o => o.propNames.join('.') == propNames.join('.'))[0]
            return editor
        }

        static setPropEditor(componentType: React.ComponentClass | string, propName: string, editorType: PropEditorConstructor, group?: string, ): void {
            group = group || ''
            let propNames = (propName as string).split('.')

            let className = typeof componentType == 'string' ? componentType : componentType.prototype.typename || componentType.name
            let classProps = Component.controlPropEditors[className] = Component.controlPropEditors[className] || []
            for (let i = 0; i < classProps.length; i++) {
                let propName1 = classProps[i].propNames.join('.')
                let propName2 = propNames.join('.')
                if (propName1 == propName2) {
                    classProps[i].editorType = editorType
                    return
                }
            }
            classProps.push({ propNames: propNames, editorType, group })
        }

        /**
         * 将持久化的元素数据转换为 ReactElement
         * @param args 元素数据
         */
        static createElement(args: ComponentData, h?: ReactFactory): React.ReactElement<any> | null {

            h = h || React.createElement

            try {

                let type: string | React.ComponentClass = args.type;
                let componentName = args.type;
                let controlType = Component.componentTypes[componentName];
                if (controlType) {
                    type = controlType;
                }

                let children = args.children ? args.children.map(o => Component.createElement(o, h)) : [];

                console.assert(args.props)
                let props = JSON.parse(JSON.stringify(args.props));
                let result: JSX.Element
                result = h(type, props, ...children);

                return result
            }
            catch (e) {
                console.error(e);
                return null;
            }
        }

        private static componentTypes = {} as { [key: string]: React.ComponentClass<any> | string }
        static register(componentName: string, componentType: React.ComponentClass<any>): void {
            if (componentType == null && typeof componentName == 'function') {
                componentType = componentName;
                componentName = (componentType as React.ComponentClass<any>).name;
                (componentType as any)['componentName'] = componentName;
            }

            if (!componentName)
                throw Errors.argumentNull('componentName');

            if (!componentType)
                throw Errors.argumentNull('componentType');

            Component.componentTypes[componentName] = componentType;
        }

    }
}