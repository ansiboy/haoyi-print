/// <reference types="react" />
/// <reference types="jquery" />
/// <reference types="jqueryui" />
declare namespace jueying {
    function guid(): string;
    let classNames: {
        controlSelected: string;
        emptyTemplates: string;
        loadingTemplates: string;
        templateSelected: string;
        templateDialog: string;
    };
}
declare namespace jueying {
    interface EditorProps extends React.Props<ControlEditor> {
    }
    interface EditorState {
        editors: {
            text: string;
            editor: React.ReactElement<any>;
        }[];
    }
    class ControlEditor extends React.Component<EditorProps, EditorState> {
        private _element;
        constructor(props: EditorProps);
        setControls(controls: Control<any, any>[]): void;
        private setPropsValue;
        private getPropsValue;
        private flatProps;
        private isSameEditor;
        render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        readonly element: HTMLElement;
        Element(...children: React.ReactElement<any>[]): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}
declare namespace jueying {
    class ControlFactory {
        private static getControlType;
        private static exportElement;
        private static getComponentNameByType;
        private static trimProps;
        static create(args: ElementData, designer?: PageDesigner): React.ReactElement<any> | null;
        static register(controlType: React.ComponentClass<any>): void;
        static register(controlName: string, controlType: React.ComponentClass<any>): void;
        static register(controlName: string, controlPath: string): void;
        static loadAllTypes(): Promise<any[]>;
        static createElement(control: Control<any, any>, type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]): React.ReactElement<any>;
        static createDesignTimeElement(control: Control<any, any>, type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]): React.ReactElement<any>;
        private static createRuntimeElement;
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
    interface ControlProps<T> extends React.Props<T> {
        id?: string;
        name?: string;
        className?: string;
        style?: React.CSSProperties;
        tabIndex?: number;
        componentName?: string;
        designMode?: boolean;
    }
    interface ControlState {
        selected: boolean;
    }
    abstract class Control<P extends ControlProps<any>, S> extends React.Component<P, S> {
        private _designer;
        private originalComponentDidMount;
        private originalRender;
        static tabIndex: number;
        static componentsDir: string;
        static connectorElementClassName: string;
        static controlTypeName: string;
        protected hasCSS: boolean;
        element: HTMLElement;
        constructor(props: P);
        readonly id: string;
        readonly isDesignMode: boolean;
        readonly componentName: any;
        readonly designer: PageDesigner;
        static htmlDOMProps(props: any): {
            [key: string]: any;
        };
        protected loadControlCSS(): Promise<void>;
        private myComponentDidMount;
        Element(child: React.ReactElement<any>): React.ReactElement<any> | null;
        Element(props: any, element: React.ReactElement<any>): React.ReactElement<any> | null;
        Element(type: string, ...children: React.ReactElement<any>[]): React.ReactElement<any> | null;
        Element(type: string, props: ControlProps<this>, ...children: React.ReactElement<any>[]): React.ReactElement<any> | null;
        protected createElement(type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]): React.ReactElement<any>;
        private static render;
        private static getControlType;
        static loadTypes(elementData: ElementData): Promise<any[]>;
        static loadAllTypes(): Promise<any[]>;
        static getInstance(id: string): Control<any, any>;
        static create(args: ElementData): React.ReactElement<any> | null;
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
        pageData: ElementData | null;
    }
    interface PageDesignerState {
        pageData: ElementData | null;
    }
    class Callback<T> {
        private funcs;
        constructor();
        add(func: (args: T) => void): void;
        remove(func: (args: T) => any): void;
        fire(args: T): void;
        static create<T>(): Callback<T>;
    }
    class PageDesigner extends React.Component<PageDesignerProps, PageDesignerState> {
        private _selectedControlIds;
        element: HTMLElement;
        controlSelected: Callback<Control<ControlProps<any>, any>[]>;
        controlUnselected: Callback<Control<ControlProps<any>, any>[]>;
        controlRemoved: Callback<string[]>;
        controlComponentDidMount: Callback<Control<any, any>>;
        constructor(props: PageDesignerProps);
        componentWillReceiveProps(props: PageDesignerProps): void;
        pageData: ElementData | null;
        readonly selectedControlIds: string[];
        updateControlProps(controlId: string, navPropsNames: string[], value: any): any;
        sortControlChildren(controlId: string, childIds: string[]): void;
        sortChildren(parentId: string, childIds: string[]): void;
        /** 添加控件 */
        appendControl(parentId: string, childControl: ElementData, childIds?: string[]): void;
        /** 设置控件位置 */
        setControlPosition(controlId: string, left: number | string, top: number | string): void;
        selectSingleControlById(controlId: string): void;
        selectSingleControl(control: Control<any, any>): void;
        /**
         * 选择指定的控件
         * @param control 指定的控件
         */
        selectControl(...controls: Control<any, any>[]): void;
        /**
         * 取消选择
         * @param control 指定的控件
         */
        unselectControl(...controls: Control<any, any>[]): void;
        /** 清除已经选择的控件 */
        clearSelectdControls(): void;
        /** 移除控件 */
        removeControl(...controlIds: string[]): void;
        /** 移动控件到另外一个控件容器 */
        moveControl(controlId: string, parentId: string, childIds: string[]): void;
        private removeControlFrom;
        protected findControlData(controlId: string): ElementData | null;
        private onKeyDown;
        setControlPropEditor(): void;
        render(): JSX.Element;
    }
    type DesignerContextValue = {
        designer: PageDesigner | null;
    };
    const DesignerContext: React.Context<DesignerContextValue>;
}
declare namespace jueying {
    class ControlEditorFactory {
        private static controlEditorTypes;
        static register(controlTypeName: any, editorType: React.ComponentClass<any> | string): void;
        static hasEditor(controlTypeName: any): boolean;
    }
    interface PropEditorInfo {
        propNames: string[];
        text: string;
        editorType: PropEditorConstructor;
    }
    class ControlPropEditors {
        private static controlPropEditors;
        static getControlPropEditors(controlClassName: string): PropEditorInfo[];
        static getControlPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClassName: string, propName: K, propName1: K1): PropEditorInfo;
        static getControlPropEditor<T, K extends keyof T>(controlClassName: string, propName: string): PropEditorInfo;
        /** 通过属性数组获取属性的编辑器 */
        static getControlPropEditorByArray(controlClassName: string, propNames: string[]): PropEditorInfo;
        static setControlPropEditor<T, K extends keyof T, K1 extends keyof T[K]>(controlClass: React.ComponentClass, text: string, editorType: PropEditorConstructor, propName: K, propName1: any): void;
        static setControlPropEditor<T, K extends keyof T>(controlClass: React.ComponentClass, text: string, editorType: PropEditorConstructor, propName: K): void;
        static getFlatPropValue(obj: Object, flatPropName: string): void;
    }
}
declare namespace jueying {
    interface ControlPlaceholderState {
        controls: ElementData[];
    }
    interface ControlPlaceholderProps extends ControlProps<ControlPlaceholder> {
        style?: React.CSSProperties;
        emptyText?: string;
        htmlTag?: string;
    }
    class ControlPlaceholder extends Control<ControlPlaceholderProps, ControlPlaceholderState> {
        private controls;
        static defaultProps: {
            className: string;
            layout: string;
        };
        pageView: PageView;
        constructor(props: any);
        private sortableElement;
        private droppableElement;
        private childrenIds;
        componentDidMount(): void;
        render(h?: any): JSX.Element;
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
        draggable(selector: JQuery): void;
        render(): JSX.Element;
    }
}
declare namespace jueying {
    interface EditorPanelState {
    }
    interface EditorPanelProps {
        className?: string;
        style?: React.CSSProperties;
        emptyText?: string;
    }
    class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
        private designer;
        private element;
        private editor;
        constructor(props: any);
        componentDidMount(): void;
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
        data: ElementData;
    }
    interface ElementData {
        type: string;
        props: any;
        children?: ElementData[];
    }
    interface ComponentDefine {
        name: string;
        displayName: string;
        icon: string;
        introduce: string;
        target?: 'view' | 'footer' | 'header';
        visible?: boolean;
        controlPath: string;
        editorPath: string;
    }
}
declare namespace jueying {
    interface PageViewProps extends ControlProps<any> {
        style?: React.CSSProperties;
        className?: string;
        layout?: 'flowing' | 'absolute';
    }
    const PageViewContext: React.Context<{
        pageView: PageView;
    }>;
    type ControlPair = {
        control: Control<any, any>;
        controlType: React.ComponentClass<any>;
    };
    type State = {};
    /**
     * 移动端页面，将 PageData 渲染为移动端页面。
     */
    class PageView extends Control<PageViewProps, State> {
        static defaultProps: PageViewProps;
        constructor(props: PageViewProps);
        readonly layout: "flowing" | "absolute";
        render(h?: any): React.ReactElement<any>;
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
declare namespace jueying.extentions {
    function guid(): string;
    function isEquals(obj1: object, obj2: object): boolean;
}
declare namespace jueying.extentions {
    type ElementData = jueying.ElementData;
    interface DocumentData {
        pageData: ElementData;
        name: string;
    }
    let templates: DocumentData[];
}
declare namespace jueying.extentions {
    interface DesignerFrameworkProps {
        components: jueying.ComponentDefine[];
        title?: string;
        templates?: DocumentData[];
    }
    interface DesignerFrameworkState {
        changed: boolean;
        canUndo: boolean;
        canRedo: boolean;
        activeDocumentIndex?: number;
        pageDocuments?: PageDocument[];
    }
    class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState> {
        protected pageDesigner: jueying.PageDesigner;
        private names;
        private _storage;
        private ruleElement;
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
        createDocuemnt(fileName: string, pageData: ElementData, isNew: boolean): Promise<void>;
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
        render(): JSX.Element;
    }
}
declare namespace jueying.extentions {
    interface DocumentStorage {
        list(pageIndex: number, pageSize: number): Promise<{
            items: [string, ElementData][];
            count: number;
        }>;
        load(name: string): Promise<ElementData>;
        save(name: string, pageData: ElementData): Promise<any>;
        remove(name: string): Promise<any>;
    }
    class LocalDocumentStorage implements DocumentStorage {
        private static prefix;
        constructor();
        list(pageIndex: any, pageSize: any): Promise<{
            items: [string, ElementData][];
            count: number;
        }>;
        load(name: string): Promise<any>;
        save(name: string, pageData: ElementData): Promise<void>;
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
        constructor(fileName: any, storage: DocumentStorage, pageData: ElementData, isNew?: boolean);
        save(): Promise<any>;
        readonly isChanged: boolean;
        readonly name: string;
        readonly pageData: ElementData;
        static load(storage: DocumentStorage, fileName: string): Promise<PageDocument>;
        static new(storage: DocumentStorage, fileName: string, init: ElementData): PageDocument;
    }
}
declare namespace jueying.extentions {
    let classNames: {
        controlSelected: string;
        emptyTemplates: string;
        loadingTemplates: string;
        templateSelected: string;
        templateDialog: string;
        emptyDocument: string;
    };
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
