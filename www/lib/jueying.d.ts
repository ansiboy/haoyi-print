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
declare namespace jueying {
    interface ComponentWrapperProps {
        id: string;
        style: React.CSSProperties;
        type: string | React.ComponentClass;
        selected: boolean;
        designer: PageDesigner;
    }
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
        private static invokeOnClick;
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
    class Component {
        private static defaultComponentAttribute;
        private static componentAttributes;
        static setComponentAttribute(typename: string, attr: ComponentAttribute): void;
        static getComponentAttribute(typename: string): ComponentAttribute;
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
    }
    interface EditorState {
        editors: {
            group: string;
            prop: string;
            editor: React.ReactElement<any>;
        }[];
    }
    class ComponentEditor extends React.Component<EditorProps, EditorState> {
        private _element;
        constructor(props: EditorProps);
        setControls(controls: ComponentData[], designer: PageDesigner): void;
        private flatProps;
        render(): JSX.Element;
        readonly element: HTMLElement;
    }
}
declare namespace jueying {
    interface ComponentToolbarProps extends React.Props<ComponentToolbar> {
        componets: ComponentDefine[];
        style?: React.CSSProperties;
        className?: string;
    }
    interface ComponentToolbarState {
    }
    class ComponentToolbar extends React.Component<ComponentToolbarProps, ComponentToolbarState> {
        designer: PageDesigner;
        private toolbarElement;
        componentDidMount(): void;
        private componentDraggable;
        render(): JSX.Element;
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
 * core 文件用于运行时加载，所以要控制此文件的大小，用于在运行时创建页面
 *
 ********************************************************************************/
declare namespace jueying {
    type DesignerContextValue = {
        designer: PageDesigner | null;
    };
    const DesignerContext: React.Context<DesignerContextValue>;
    interface DesigntimeComponent {
        /** 运行时控件的类型名称 */
        typename: string;
        designer: PageDesigner;
    }
    function component<T extends React.Component>(args?: ComponentAttribute): (constructor: new (...args: any[]) => T) => new (...args: any[]) => T;
    let core: {
        createElement: typeof createElement;
        componentTypes: {
            [key: string]: string | React.ComponentClass<any, any>;
        };
        register: typeof register;
        loadAllTypes: typeof loadAllTypes;
    };
    type ReactFactory = (type: string | React.ComponentClass<any>, props: ComponentProps<any>, ...children: any[]) => JSX.Element;
    /**
     * 将持久化的元素数据转换为 ReactElement
     * @param args 元素数据
     */
    function createElement(args: ComponentData, h?: ReactFactory): React.ReactElement<any> | null;
    function register(componentName: string, componentType: React.ComponentClass<any>): void;
    function loadAllTypes(): Promise<any[]>;
}
declare namespace jueying {
    interface PropEditorInfo {
        propNames: string[];
        editorType: PropEditorConstructor;
        group: string;
    }
    /** 组件属性编辑器，为组件的属性提供可视化的编辑器 */
    class ComponentPropEditor {
        private static controlPropEditors;
        static getControlPropEditors(controlClassName: string): PropEditorInfo[];
        static getControlPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClassName: string, propName: K, propName1: K1): PropEditorInfo;
        static getControlPropEditor<T, K extends keyof T>(controlClassName: string, propName: string): PropEditorInfo;
        /** 通过属性数组获取属性的编辑器 */
        static getControlPropEditorByArray(controlClassName: string, propNames: string[]): PropEditorInfo;
        static setControlPropEditor(componentType: React.ComponentClass | string, propName: string, editorType: PropEditorConstructor, group?: string): void;
    }
}
declare namespace jueying {
    interface EditorPanelState {
        componentDatas: ComponentData[];
        designer?: PageDesigner;
        selectedComponentId?: string;
    }
    interface EditorPanelProps {
        className?: string;
        style?: React.CSSProperties;
        emptyText?: string;
    }
    class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
        private element;
        private editor;
        constructor(props: any);
        setDesigner(designer: PageDesigner): void;
        render(): JSX.Element;
    }
}
declare namespace jueying {
    class Errors {
        static fileNotExists(fileName: string): any;
        static argumentNull(argumentName: string): Error;
        static pageDataIsNull(): Error;
    }
}
declare namespace jueying {
    interface Document {
        name?: string;
        createDateTime?: Date;
        version?: number;
        /**
         * 页面的类型，默认为 page
         * snapshoot 为页面快照
         * productTemplate 为商品模板
         * page 为普通页面
         * system 为系统页面
         */
        type?: 'snapshoot' | 'productTemplate' | 'page' | 'system';
        data: ComponentData;
    }
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
        target?: 'view' | 'footer' | 'header';
        visible?: boolean;
        controlPath: string;
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
        private _selectedControlIds;
        element: HTMLElement;
        componentSelected: Callback<string[]>;
        controlRemoved: Callback<string[]>;
        designtimeComponentDidMount: Callback<{
            component: React.ReactElement<any>;
            element: HTMLElement;
        }>;
        componentUpdated: Callback<PageDesigner>;
        namedComponents: {
            [key: string]: ComponentData;
        };
        constructor(props: PageDesignerProps);
        initPageData(pageData: ComponentData): void;
        readonly pageData: ComponentData;
        readonly selectedComponentIds: string[];
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
        moveControl(controlId: string, parentId: string, childIds: string[]): void;
        private setComponentSelected;
        private removeControlFrom;
        findComponentData(controlId: string): ComponentData | null;
        private onKeyDown;
        private createDesignTimeElement;
        componentWillReceiveProps(props: PageDesignerProps): void;
        componentDidUpdate(): void;
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
    }, emptyText?: string): {
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
}
declare namespace jueying.extentions {
    function guid(): string;
    function isEquals(obj1: object, obj2: object): boolean;
}
declare namespace jueying.extentions {
    type ElementData = jueying.ComponentData;
    interface DocumentData {
        pageData: ElementData;
        name: string;
    }
    let templates: DocumentData[];
}
declare namespace jueying.extentions {
    interface DesignerFrameworkProps {
        components: ComponentDefine[];
        title?: string;
        templates?: DocumentData[];
    }
    interface DesignerFrameworkState {
        changed: boolean;
        canUndo: boolean;
        canRedo: boolean;
        pageDocuments?: PageDocument[];
        activeDocument?: PageDocument;
    }
    class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState> {
        protected pageDesigner: PageDesigner;
        private names;
        private _storage;
        private ruleElement;
        private editorPanel;
        private toolbarElement;
        constructor(props: any);
        static defaultProps: DesignerFrameworkProps;
        /** 对控件进行命名 */
        private namedControl;
        createButtons(pageDocument: PageDocument, buttonClassName?: string): JSX.Element[];
        readonly storage: DocumentStorage;
        static readonly dialogsElement: HTMLElement;
        undo(): void;
        redo(): void;
        save(): Promise<void>;
        createDocuemnt(fileName: string, pageData: ComponentData, isNew: boolean): Promise<void>;
        fetchTemplates(): Promise<{
            items: DocumentData[];
            count: number;
        }>;
        newFile(): Promise<void>;
        open(): void;
        private activeDocument;
        setState<K extends keyof DesignerFrameworkState>(state: (Pick<DesignerFrameworkState, K> | DesignerFrameworkState)): void;
        private closeDocument;
        componentDidMount(): void;
        designerRef(e: PageDesigner): void;
        renderToolbar(element: HTMLElement): void;
        render(): JSX.Element;
    }
}
declare namespace jueying.extentions {
    interface DocumentStorage {
        list(pageIndex: number, pageSize: number): Promise<{
            items: [string, ComponentData][];
            count: number;
        }>;
        load(name: string): Promise<ComponentData>;
        save(name: string, pageData: ComponentData): Promise<any>;
        remove(name: string): Promise<any>;
    }
    class LocalDocumentStorage implements DocumentStorage {
        private static prefix;
        constructor();
        list(pageIndex: any, pageSize: any): Promise<{
            items: [string, ComponentData][];
            count: number;
        }>;
        load(name: string): Promise<any>;
        save(name: string, pageData: ComponentData): Promise<void>;
        remove(name: string): Promise<any>;
    }
}
declare namespace jueying.extentions {
    class PageDocument {
        private static instances;
        private storage;
        private _pageData;
        private originalPageData;
        private fileName;
        constructor(fileName: any, storage: DocumentStorage, pageData: ComponentData, isNew?: boolean);
        save(): Promise<any>;
        readonly isChanged: boolean;
        readonly name: string;
        readonly pageData: ComponentData;
        static load(storage: DocumentStorage, fileName: string): Promise<PageDocument>;
        static new(storage: DocumentStorage, fileName: string, init: ComponentData): PageDocument;
    }
}
declare namespace jueying.extentions {
    type LoadDocuments = (pageIndex: number, pageSize: number) => Promise<{
        items: DocumentData[];
        count: number;
    }>;
    interface TemplateDialogProps {
    }
    interface TemplateDialogState {
        templates: DocumentData[];
        templatesCount?: number;
        pageIndex: number;
        selectedTemplateIndex: number;
        fileName?: string;
        showFileNameInput: boolean;
    }
    class TemplateDialog extends React.Component<TemplateDialogProps, TemplateDialogState> {
        private fetchTemplates;
        private callback;
        private currentPageIndex;
        private validator;
        constructor(props: any);
        private selectTemplate;
        private confirm;
        loadTemplates(pageIndex: number): Promise<void>;
        componentDidMount(): void;
        showPage(pageIndex: number): Promise<void>;
        render(): JSX.Element;
        open(requiredFileName?: boolean): void;
        close(): void;
        static show(args: {
            fetch: LoadDocuments;
            requiredFileName?: boolean;
            callback?: (tmp: DocumentData, fileName?: string) => void;
        }): void;
    }
}
