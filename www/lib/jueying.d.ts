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
    interface EditorProps extends React.Props<ControlEditor<any, any>> {
        control: Control<any, any>;
    }
    class ControlEditor<P extends EditorProps, S> extends React.Component<P, S> {
        private originalRender;
        private _element;
        constructor(props: P);
        readonly designer: PageDesigner;
        readonly element: HTMLElement;
        setState<K extends keyof S>(state: (Pick<S, K> | S), callback?: () => void): void;
        Element(...children: React.ReactElement<any>[]): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        componentWillReceiveProps(props: P): void;
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
        readonly hasEditor: boolean;
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
        private selectedControlId;
        element: HTMLElement;
        controlSelected: Callback<Control<ControlProps<any>, any>>;
        controlComponentDidMount: Callback<Control<any, any>>;
        constructor(props: PageDesignerProps);
        componentWillReceiveProps(props: PageDesignerProps): void;
        pageData: ElementData | null;
        updateControlProps(controlId: string, props: any): any;
        sortControlChildren(controlId: string, childIds: string[]): void;
        sortChildren(parentId: string, childIds: string[]): void;
        /** 添加控件 */
        appendControl(parentId: string, childControl: ElementData, childIds?: string[]): void;
        /** 设置控件位置 */
        setControlPosition(controlId: string, left: number | string, top: number | string): void;
        selectControlById(controlId: string): void;
        /**
         * 选择指定的控件
         * @param control 指定的控件，可以为空，为空表示清空选择。
         */
        selectControl(control: Control<any, any>): void;
        /** 清除已经选择的控件 */
        clearSelectControl(): void;
        /** 移除控件 */
        removeControl(controlId: string): void;
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
        static create(control: Control<any, any>): Promise<React.ComponentElement<any, React.Component<any, any, any>>>;
        static hasEditor(controlTypeName: any): boolean;
    }
    class ControlPropEditors {
        private static controlPropEditors;
        static getControlPropEditor(controlClassName: string): {
            [propName: string]: {
                text: string;
                editorType: PropEditor<any>;
            };
        };
        static setControlPropEditor<T, K extends keyof T>(controlClass: React.ComponentClass, propName: K, text: string, editorType: PropEditor<T[K]>): void;
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
    interface ControlPlaceholderEditorState extends Partial<ControlPlaceholderProps> {
    }
    class ControlPlaceholderEditor extends ControlEditor<EditorProps, ControlPlaceholderEditorState> {
        render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
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
        editor: React.ReactElement<any>;
    }
    interface EditorPanelProps {
        className?: string;
        style?: React.CSSProperties;
        emptyText?: string;
    }
    class EditorPanel extends React.Component<EditorPanelProps, EditorPanelState> {
        private designer;
        private element;
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
    interface PageViewEditorState extends PageViewProps {
    }
    class PageViewEditor extends ControlEditor<EditorProps, PageViewEditorState> {
        render(): React.DetailedReactHTMLElement<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
}
declare namespace jueying {
    interface PropEditor<T> {
        (value: T, onChange: (value: T) => void): React.ReactElement<any>;
    }
    let textInput: PropEditor<string>;
    function dropdown(items: {
        [value: string]: string;
    }): (value: string, onChange: (value: string) => void) => JSX.Element;
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
