/// <reference types="react" />
declare namespace jueying {
    let constants: {
        componentsDir: string;
        connectorElementClassName: string;
        componentTypeName: string;
        componentData: string;
    };
    let strings: {
        [key: string]: string;
    };
    function guid(): string;
    class Callback<T> {
        private funcs;
        add(func: (args: T) => void): void;
        remove(func: (args: T) => any): void;
        fire(args: T): void;
        static create<T>(): Callback<T>;
    }
}
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
declare namespace jueying {
    interface EditorProps extends React.Props<ComponentEditor> {
        designer: PageDesigner;
    }
    interface EditorState {
        editors: {
            group: string;
            prop: string;
            editor: React.ReactElement<any>;
        }[];
        designer?: PageDesigner;
    }
    class ComponentEditor extends React.Component<EditorProps, EditorState> {
        private _element;
        constructor(props: EditorProps);
        componentWillReceiveProps(props: EditorProps): void;
        private getEditors;
        private flatProps;
        render(): JSX.Element;
        readonly element: HTMLElement;
    }
}
declare namespace jueying {
    interface ComponentToolbarProps extends React.Props<ComponentPanel> {
        style?: React.CSSProperties;
        className?: string;
    }
    interface ComponentToolbarState {
        componets: ComponentDefine[];
    }
    class ComponentPanel extends React.Component<ComponentToolbarProps, ComponentToolbarState> {
        designer: PageDesigner;
        private toolbarElement;
        constructor(props: any);
        private componentDraggable;
        setComponets(componets: ComponentDefine[]): void;
        static getComponentData(dataTransfer: DataTransfer): ComponentData;
        /** 获取光标在图标内的位置 */
        static mouseInnerPosition(dataTransfer: DataTransfer): {
            x: number;
            y: number;
        };
        render(): JSX.Element;
    }
}
declare namespace jueying {
    type ComponentWrapperProps = {
        designer: PageDesigner;
        type: string | React.ComponentClass;
    } & ComponentProps<ComponentWrapper>;
    class ComponentWrapper extends React.Component<ComponentWrapperProps, any> {
        private handler;
        private element;
        private static isDrag;
        designtimeBehavior(element: HTMLElement, attr: {
            container?: boolean;
            movable?: boolean;
        }): void;
        /**
         * 启用拖放操作，以便通过拖放图标添加控件
         */
        static enableDroppable(element: HTMLElement, designer: PageDesigner): void;
        private static isResizeHandleClassName;
        static draggable(designer: PageDesigner, element: HTMLElement, handler?: HTMLElement): void;
        static invokeOnClick(ev: MouseEvent, designer: PageDesigner, element: HTMLElement): void;
        componentDidMount(): void;
        render(): JSX.Element;
    }
    interface ComponentAttribute {
        /** 表示组件为容器，可以添加组件 */
        container?: boolean;
        /** 表示组件可移动 */
        movable?: boolean;
        showHandler?: boolean;
        resize?: boolean;
    }
}
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
declare namespace jueying {
    type ReactFactory = (type: string | React.ComponentClass<any> | React.ComponentType, props: ComponentProps<any>, ...children: any[]) => JSX.Element;
    type DesignerContextValue = {
        designer: PageDesigner | null;
    };
    const DesignerContext: React.Context<DesignerContextValue>;
    interface PropEditorInfo {
        propNames: string[];
        editorType: PropEditorConstructor;
        group: string;
    }
    function component<T extends React.Component>(args?: ComponentAttribute): (constructor: new (...args: any[]) => T) => new (...args: any[]) => T;
    class Component {
        static readonly Fragment: string;
        private static defaultComponentAttribute;
        private static componentAttributes;
        /**
         * 设置组件特性
         * @param typename 组件类型名称
         * @param attr 组件特性
         */
        static setAttribute(typename: string, attr: ComponentAttribute): void;
        /**
         * 获取组件特性
         * @param typename 组件类型名称
         */
        static getAttribute(type: string | React.ComponentClass<any>): ComponentAttribute;
        private static controlPropEditors;
        static getPropEditors(controlClassName: string): PropEditorInfo[];
        static getPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClassName: string, propName: K, propName1: K1): PropEditorInfo;
        static getPropEditor<T, K extends keyof T>(controlClassName: string, propName: string): PropEditorInfo;
        /** 通过属性数组获取属性的编辑器 */
        static getPropEditorByArray(controlClassName: string, propNames: string[]): PropEditorInfo;
        static setPropEditor(componentType: React.ComponentClass | string, propName: string, editorType: PropEditorConstructor, group?: string): void;
        /**
         * 将持久化的元素数据转换为 ReactElement
         * @param args 元素数据
         */
        static createElement(args: ComponentData, h?: ReactFactory): React.ReactElement<any> | null;
        private static componentTypes;
        static register(componentName: string, componentType: React.ComponentClass<any>): void;
    }
}
declare namespace jueying {
    interface EditorPanelState {
        componentDatas: ComponentData[];
        designer?: PageDesigner;
    }
    interface EditorPanelProps {
        className?: string;
        style?: React.CSSProperties;
        emptyText?: string;
        designer?: PageDesigner;
    }
    class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
        private element;
        private editor;
        constructor(props: any);
        componentWillReceiveProps(props: EditorPanelProps): void;
        private getComponentData;
        render(): JSX.Element;
    }
}
declare namespace jueying {
    class Errors {
        static fileNotExists(fileName: string): any;
        static argumentNull(argumentName: string): Error;
        static pageDataIsNull(): Error;
        static toolbarRequiredKey(): Error;
        static loadPluginFail(pluginId: string): Error;
    }
}
declare namespace jueying {
    interface ComponentData {
        type: string;
        props?: ComponentProps<any>;
        children?: ComponentData[];
    }
    interface ComponentDefine {
        componentData: ComponentData;
        displayName: string;
        icon: string;
        introduce: string;
    }
}
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
declare namespace jueying {
    interface PageDesignerProps extends React.Props<PageDesigner> {
        pageData: ComponentData | null;
        style?: React.CSSProperties;
    }
    interface PageDesignerState {
        pageData: ComponentData | null;
    }
    interface ComponentProps<T> extends React.Props<T> {
        id?: string;
        name?: string;
        className?: string;
        style?: React.CSSProperties;
        tabIndex?: number;
        componentName?: string;
        designMode?: boolean;
        selected?: boolean;
        onClick?: (e: MouseEvent) => void;
    }
    class PageDesigner extends React.Component<PageDesignerProps, PageDesignerState> {
        private element;
        componentSelected: Callback<string[]>;
        componentRemoved: Callback<string[]>;
        componentAppend: Callback<PageDesigner>;
        componentUpdated: Callback<ComponentData[]>;
        designtimeComponentDidMount: Callback<{
            component: React.ReactElement<any>;
            element: HTMLElement;
        }>;
        namedComponents: {
            [key: string]: ComponentData;
        };
        constructor(props: PageDesignerProps);
        initPageData(pageData: ComponentData): void;
        readonly pageData: ComponentData;
        readonly selectedComponentIds: string[];
        readonly selectedComponents: ComponentData[];
        updateControlProps(controlId: string, navPropsNames: string[], value: any): any;
        private sortChildren;
        /**
         * 对组件及其子控件进行命名
         * @param component
         */
        private nameComponent;
        /** 添加控件 */
        appendComponent(parentId: string, childControl: ComponentData, childIds?: string[]): void;
        /** 设置控件位置 */
        setComponentPosition(componentId: string, position: {
            left: number | string;
            top: number | string;
        }): void;
        setComponentSize(componentId: string, size: {
            width?: number | string;
            height?: number | string;
        }): void;
        setComponentsPosition(positions: {
            componentId: string;
            position: {
                left: number | string;
                top: number | string;
            };
        }[]): void;
        /**
         * 选择指定的控件
         * @param control 指定的控件
         */
        selectComponent(componentIds: string[] | string): void;
        /** 移除控件 */
        removeControl(...controlIds: string[]): void;
        /** 移动控件到另外一个控件容器 */
        moveControl(componentId: string, parentId: string, childIds: string[]): void;
        private setComponentSelected;
        private removeControlFrom;
        findComponentData(controlId: string): ComponentData | null;
        private onKeyDown;
        private createDesignTimeElement;
        componentWillReceiveProps(props: PageDesignerProps): void;
        render(): JSX.Element;
    }
}
declare namespace jueying {
    interface PropEditorConstructor {
        new (props: PropEditorProps<any>): any;
    }
    interface PropEditorProps<T> {
        value: T;
        onChange: (value: T) => void;
    }
    interface PropEditorState<T> {
        value: T;
    }
    abstract class PropEditor<S extends PropEditorState<T>, T> extends React.Component<PropEditorProps<T>, S> {
        constructor(props: PropEditorProps<T>);
        componentWillReceiveProps(props: PropEditorProps<T>): void;
    }
    class TextInput extends PropEditor<PropEditorState<string>, string> {
        render(): JSX.Element;
    }
    function dropdown(items: {
        [value: string]: string;
    } | string[], emptyText?: string): {
        new (props: PropEditorProps<string>): {
            render(): JSX.Element;
            componentWillReceiveProps(props: PropEditorProps<string>): void;
            setState<K extends "value">(state: {
                value: string;
            } | ((prevState: Readonly<{
                value: string;
            }>, props: Readonly<PropEditorProps<string>>) => {
                value: string;
            } | Pick<{
                value: string;
            }, K>) | Pick<{
                value: string;
            }, K>, callback?: () => void): void;
            forceUpdate(callBack?: () => void): void;
            readonly props: Readonly<{
                children?: React.ReactNode;
            }> & Readonly<PropEditorProps<string>>;
            state: Readonly<{
                value: string;
            }>;
            context: any;
            refs: {
                [key: string]: React.ReactInstance;
            };
            componentDidMount?(): void;
            shouldComponentUpdate?(nextProps: Readonly<PropEditorProps<string>>, nextState: Readonly<{
                value: string;
            }>, nextContext: any): boolean;
            componentWillUnmount?(): void;
            componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
            getSnapshotBeforeUpdate?(prevProps: Readonly<PropEditorProps<string>>, prevState: Readonly<{
                value: string;
            }>): any;
            componentDidUpdate?(prevProps: Readonly<PropEditorProps<string>>, prevState: Readonly<{
                value: string;
            }>, snapshot?: any): void;
            componentWillMount?(): void;
            UNSAFE_componentWillMount?(): void;
            UNSAFE_componentWillReceiveProps?(nextProps: Readonly<PropEditorProps<string>>, nextContext: any): void;
            componentWillUpdate?(nextProps: Readonly<PropEditorProps<string>>, nextState: Readonly<{
                value: string;
            }>, nextContext: any): void;
            UNSAFE_componentWillUpdate?(nextProps: Readonly<PropEditorProps<string>>, nextState: Readonly<{
                value: string;
            }>, nextContext: any): void;
        };
    };
}
declare namespace jueying {
    let classNames: {
        componentSelected: string;
        emptyTemplates: string;
        loadingTemplates: string;
        templateSelected: string;
        templateDialog: string;
        emptyDocument: string;
        component: string;
        componentWrapper: string;
    };
    function appendClassName(sourceClassName: string, addonClassName: any): string;
    function removeClassName(sourceClassName: string, targetClassName: any): string;
}
declare namespace jueying.forms {
    interface Plugin {
        init?(form: DesignerFramework): any;
        onDocumentActived?(args: {
            document: PageDocument;
        }): {
            components?: ComponentDefine[];
        };
    }
}
declare namespace jueying.forms {
    let defaultPluginSingleton: boolean;
    interface Config {
        index: string;
        plugins: {
            /** 插件 ID */
            id: string;
            /** 插件名称 */
            name: string;
            /** 插件加载文件路径 */
            path: string;
            /** 主界面启动后，是否主动加载该插件 */
            autoLoad?: boolean;
            /** 是否单例，默认为 true */
            singleton?: boolean;
        }[];
        startup: string[];
    }
}
declare namespace jueying.forms {
    type ElementData = jueying.ComponentData;
    /**
     * 页面文档，定义页面文档的数据结构
     */
    interface PageDocument {
        pageData: ElementData;
        name: string;
        /** 组件文件夹，该文档可用组件的文件夹名称 */
        plugin?: string;
    }
}
declare namespace jueying.forms {
    type DesignerFrameworkProps = {
        config: Config;
    };
    type DesignerFrameworkState = {
        documents: PageDocument[];
        activeDocument?: PageDocument;
        buttons: JSX.Element[];
    };
    class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState> {
        protected pageDesigner: PageDesigner;
        private editorPanel;
        documentChanged: Callback<{
            document: PageDocument;
        }>;
        documentClosing: Callback<{
            preventClose: boolean;
            document: PageDocument;
        }>;
        documentClosed: Callback<{
            document: PageDocument;
        }>;
        documentActived: Callback<{
            document: PageDocument;
            index: number;
        }>;
        documentAdd: Callback<{
            document: PageDocument;
        }>;
        readonly plugins: (Plugin & {
            typeId: string;
        })[];
        componentPanel: ComponentPanel;
        toolbarPanel: ToolbarPanel;
        constructor(props: DesignerFrameworkProps);
        setActiveDocument(document: PageDocument): boolean;
        static readonly dialogsElement: HTMLElement;
        private activeDocument;
        private loadPlugin;
        private closeDocument;
        designerRef(e: PageDesigner, document: PageDocument): void;
        render(): JSX.Element;
    }
}
declare namespace jueying.forms {
    interface ToolbarState {
        toolbars: JSX.Element[];
    }
    class ToolbarPanel extends React.Component<{}, ToolbarState> {
        constructor(props: {});
        appendToolbar(toolbar: JSX.Element): void;
        render(): JSX.Element;
    }
}
