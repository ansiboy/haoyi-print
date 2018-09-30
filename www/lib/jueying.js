var jueying;
(function (jueying) {
    jueying.constants = {
        componentsDir: 'components',
        connectorElementClassName: 'component-container',
        componentTypeName: 'data-component-name',
        componentData: 'component-data'
    };
    jueying.propsGroups = {
        property: 'property',
        style: 'style'
    };
    jueying.strings = {
        property: '属性',
        style: '样式',
        field: '字段',
        fontSize: '字体大小',
        height: '高',
        left: '左边',
        name: '名称',
        top: '顶部',
        text: '文本',
        width: '宽'
    };
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    jueying.guid = guid;
    jueying.classNames = {
        componentSelected: `component-selected `,
        emptyTemplates: `empty-templates`,
        loadingTemplates: `loading-templates`,
        templateSelected: `template-selected`,
        templateDialog: `template-dialog`,
        component: 'component',
        componentWrapper: 'component-wrapper'
    };
    let element = document.createElement('style');
    element.type = 'text/css';
    element.innerHTML = `
        .${jueying.classNames.componentSelected} {
            border: solid 1px #337ab7!important;
        }
        .${jueying.classNames.emptyTemplates} {
            padding:50px 0;
            text-align: center;
        }
        .${jueying.classNames.loadingTemplates} {
            padding:50px 0;
            text-align: center;
        }
        .${jueying.classNames.templateSelected} .page-view {
            border: solid 1px #337ab7!important;
        }
        .${jueying.classNames.templateDialog} .name span {
            color: white;
        }
        .validationMessage {
            position: absolute;
            margin-top: -60px;
            background-color: red;
            color: white;
            padding: 4px 10px;
        }
    `;
    /*
        .${classNames.templateDialog} .name {
            margin-top: -${templateDialog.nameHeight}px;
            height: ${templateDialog.nameHeight}px;
            font-size: ${templateDialog.fontSize}px;
            text-align: center;
            padding-top: 6px;
            background-color: black;
            opacity: 0.5;
        }
    */
    document.head.appendChild(element);
})(jueying || (jueying = {}));
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
var jueying;
(function (jueying) {
    class ComponentEditor extends React.Component {
        constructor(props) {
            super(props);
            this._element = null;
            this.state = { editors: [] };
        }
        setControls(controls, designer) {
            if (controls.length == 0) {
                this.setState({ editors: [] });
                return;
            }
            // 各个控件相同的编辑器
            let commonPropEditorInfos;
            for (let i = 0; i < controls.length; i++) {
                let control = controls[i];
                let className = control.type;
                let propEditorInfos = jueying.ComponentPropEditor.getControlPropEditors(className);
                if (i == 0) {
                    commonPropEditorInfos = propEditorInfos || [];
                }
                else {
                    let items = [];
                    commonPropEditorInfos.forEach(propInfo1 => {
                        propEditorInfos.forEach(propInfo2 => {
                            let propName1 = propInfo1.propNames.join('.');
                            let propName2 = propInfo2.propNames.join('.');
                            if (propInfo1.editorType == propInfo2.editorType && propName1 == propName2) {
                                items.push(propInfo1);
                            }
                        });
                    });
                    commonPropEditorInfos = items;
                }
            }
            // 各个控件相同的属性值
            let commonFlatProps;
            for (let i = 0; i < controls.length; i++) {
                let control = controls[i];
                let controlProps = Object.assign({}, control.props);
                delete controlProps.children;
                controlProps = this.flatProps(controlProps);
                if (i == 0) {
                    commonFlatProps = controlProps;
                }
                else {
                    let obj = {};
                    for (let key in commonFlatProps) {
                        if (commonFlatProps[key] == controlProps[key])
                            obj[key] = controlProps[key];
                    }
                    commonFlatProps = obj;
                }
            }
            let editors = [];
            for (let i = 0; i < commonPropEditorInfos.length; i++) {
                let propEditorInfo = commonPropEditorInfos[i];
                let propName = propEditorInfo.propNames[propEditorInfo.propNames.length - 1];
                let editorType = propEditorInfo.editorType;
                let propNames = propEditorInfo.propNames;
                let editor = h(editorType, {
                    value: commonFlatProps[propNames.join('.')],
                    onChange: (value) => {
                        for (let i = 0; i < controls.length; i++) {
                            let c = controls[i];
                            console.assert(c.props.id);
                            designer.updateControlProps(c.props.id, propNames, value);
                        }
                    }
                });
                editors.push({ prop: propName, editor, group: propEditorInfo.group });
            }
            this.setState({ editors });
        }
        flatProps(props, baseName) {
            baseName = baseName ? baseName + '.' : '';
            let obj = {};
            for (let key in props) {
                if (typeof props[key] != 'object') {
                    obj[baseName + key] = props[key];
                }
                else {
                    Object.assign(obj, this.flatProps(props[key], key));
                }
            }
            return obj;
        }
        render() {
            let editors = this.state.editors;
            if (editors.length == 0) {
                return React.createElement("div", { className: "text-center" }, "\u6682\u65E0\u53EF\u7528\u7684\u5C5E\u6027");
            }
            let groupEditorsArray = []; //{ [group: string]: { text: string, editor: React.ReactElement<any> }[] } = {}
            for (let i = 0; i < editors.length; i++) {
                let group = editors[i].group || '';
                let groupEditors = groupEditorsArray.filter(o => o.group == group)[0]; //groupEditors[editors[i].group] = groupEditors[editors[i].group] || []
                if (groupEditors == null) {
                    groupEditors = { group: editors[i].group, editors: [] };
                    groupEditorsArray.push(groupEditors);
                }
                groupEditors.editors.push({ prop: editors[i].prop, editor: editors[i].editor });
            }
            return React.createElement(React.Fragment, null, groupEditorsArray.map((g) => React.createElement("div", { key: g.group, className: "panel panel-default" },
                React.createElement("div", { className: "panel-heading" }, jueying.strings[g.group] || g.group),
                React.createElement("div", { className: "panel-body" }, g.editors.map((o, i) => React.createElement("div", { key: i, className: "form-group" },
                    React.createElement("label", null, jueying.strings[o.prop] || o.prop),
                    React.createElement("div", { className: "control" }, o.editor)))))));
        }
        get element() {
            return this._element;
        }
        Element(...children) {
            return h('div', {
                ref: (e) => {
                    this._element = e || this._element;
                }
            }, ...children);
        }
    }
    jueying.ComponentEditor = ComponentEditor;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class ComponentToolbar extends React.Component {
        componentDidMount() {
        }
        componentDraggable(toolItemElement, componentData) {
            console.assert(toolItemElement != null);
            toolItemElement.draggable = true;
            toolItemElement.addEventListener('dragstart', function (ev) {
                componentData.props = componentData.props || {};
                // let defaultStyle = {}
                // let componentTypeName = componentData.type
                // let componentType = core.componentType(componentTypeName) || componentTypeName
                // if (componentType != null && typeof componentType != 'string' && componentType.defaultProps != null) {
                //     defaultStyle = componentType.defaultProps.style || {}
                // }
                // let left = ev.layerX;
                // let top = ev.layerY;
                // let style = Object.assign(defaultStyle, {
                //     left,
                //     top,
                // } as React.CSSProperties, componentData.props.style || {})
                // componentData.props.style = style
                ev.dataTransfer.setData(jueying.constants.componentData, JSON.stringify(componentData));
            });
        }
        render() {
            let props = Object.assign({}, this.props);
            delete props.componets;
            let componets = this.props.componets;
            return React.createElement(jueying.DesignerContext.Consumer, null, context => {
                this.designer = context.designer;
                return React.createElement("div", Object.assign({}, props, { className: "component-panel panel panel-primary" }),
                    React.createElement("div", { className: "panel-heading" }, "\u5DE5\u5177\u680F"),
                    React.createElement("div", { className: "panel-body" },
                        React.createElement("ul", { ref: (e) => this.toolbarElement = this.toolbarElement || e }, componets.map((c, i) => {
                            let props = { key: i };
                            return React.createElement("li", Object.assign({}, props, { ref: e => {
                                    if (!e)
                                        return;
                                    let ctrl = c.componentData;
                                    this.componentDraggable(e, ctrl);
                                } }),
                                React.createElement("div", { className: "btn-link" },
                                    React.createElement("i", { className: c.icon, style: { fontSize: 44, color: 'black' } })),
                                React.createElement("div", null, c.displayName));
                        }))));
            });
        }
    }
    jueying.ComponentToolbar = ComponentToolbar;
})(jueying || (jueying = {}));
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
var jueying;
(function (jueying) {
    // export let h = React.createElement
    jueying.DesignerContext = React.createContext({ designer: null });
    function component(args) {
        return function (constructor) {
            if (jueying.PageDesigner) {
                jueying.PageDesigner.setComponentAttribute(constructor.name, args);
            }
            jueying.core.register(constructor.name, constructor);
            return constructor;
        };
    }
    jueying.component = component;
    jueying.core = {
        createElement,
        componentTypes: {},
        register,
        loadAllTypes,
        componentType(name) {
            let t = jueying.core.componentTypes[name];
            return t;
        }
    };
    /**
     * 将持久化的元素数据转换为 ReactElement
     * @param args 元素数据
     */
    function createElement(args, h) {
        h = h || React.createElement;
        try {
            let type = args.type;
            let componentName = args.type;
            let controlType = jueying.core.componentTypes[componentName];
            if (controlType) {
                type = controlType;
            }
            let children = args.children ? args.children.map(o => createElement(o, h)) : [];
            console.assert(args.props);
            let props = JSON.parse(JSON.stringify(args.props));
            let result = h(type, props, ...children);
            return result;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
    function register(componentName, componentType) {
        if (componentType == null && typeof componentName == 'function') {
            componentType = componentName;
            componentName = componentType.name;
            componentType['componentName'] = componentName;
        }
        if (!componentName)
            throw jueying.Errors.argumentNull('componentName');
        if (!componentType)
            throw jueying.Errors.argumentNull('componentType');
        jueying.core.componentTypes[componentName] = componentType;
    }
    function loadAllTypes() {
        let ps = new Array();
        for (let key in jueying.core.componentTypes) {
            if (typeof jueying.core.componentTypes[key] == 'string') {
                ps.push(this.getControlType(key));
            }
        }
        return Promise.all(ps);
    }
    function componentNameByType(type) {
        for (let key in jueying.core.componentTypes) {
            if (jueying.core.componentTypes[key] == type)
                return key;
        }
        return null;
    }
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class ControlEditorFactory {
        static register(controlTypeName, editorType) {
            this.controlEditorTypes[controlTypeName] = editorType;
        }
        static hasEditor(controlTypeName) {
            return this.controlEditorTypes[controlTypeName] != null;
        }
    }
    ControlEditorFactory.controlEditorTypes = {};
    jueying.ControlEditorFactory = ControlEditorFactory;
    /** 组件属性编辑器，为组件的属性提供可视化的编辑器 */
    class ComponentPropEditor {
        static getControlPropEditors(controlClassName) {
            let classEditors = this.controlPropEditors[controlClassName] || [];
            return classEditors;
        }
        static getControlPropEditor(controlClassName, ...propNames) {
            return this.getControlPropEditorByArray(controlClassName, propNames);
        }
        /** 通过属性数组获取属性的编辑器 */
        static getControlPropEditorByArray(controlClassName, propNames) {
            let classEditors = this.controlPropEditors[controlClassName] || [];
            let editor = classEditors.filter(o => o.propNames.join('.') == propNames.join('.'))[0];
            return editor;
        }
        static setControlPropEditor(componentType, group, editorType, ...propNames) {
            let className = typeof componentType == 'string' ? componentType : componentType.prototype.typename || componentType.name;
            let classProps = ComponentPropEditor.controlPropEditors[className] = ComponentPropEditor.controlPropEditors[className] || [];
            for (let i = 0; i < classProps.length; i++) {
                let propName1 = classProps[i].propNames.join('.');
                let propName2 = propNames.join('.');
                if (propName1 == propName2) {
                    classProps[i].editorType = editorType;
                    return;
                }
            }
            classProps.push({ propNames: propNames, editorType, group });
        }
        static getFlatPropValue(obj, flatPropName) {
        }
    }
    ComponentPropEditor.controlPropEditors = {};
    jueying.ComponentPropEditor = ComponentPropEditor;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class EditorPanel extends React.Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        setControls(controlDatas, designer) {
            // let controls = controlIds.map(id => Control.getInstance(id))
            this.editor.setControls(controlDatas, designer);
        }
        render() {
            let { emptyText } = this.props;
            emptyText = emptyText || '';
            return React.createElement("div", { className: "editor-panel panel panel-primary", ref: (e) => this.element = e || this.element },
                React.createElement("div", { className: "panel-heading" }, "\u5C5E\u6027"),
                React.createElement("div", { className: "panel-body" },
                    React.createElement(jueying.ComponentEditor, { ref: e => this.editor = e || this.editor })));
        }
    }
    jueying.EditorPanel = EditorPanel;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class Errors {
        static fileNotExists(fileName) {
            return new Error(`File '${fileName}' is not exists.`);
        }
        static argumentNull(argumentName) {
            return new Error(`Argument ${argumentName} is null or empty.`);
        }
        static pageDataIsNull() {
            return new Error(`Page data is null.`);
        }
    }
    jueying.Errors = Errors;
})(jueying || (jueying = {}));
// /*******************************************************************************
//  * Copyright (C) maishu All rights reserved.
//  *
//  * HTML 页面设计器 
//  * 
//  * 作者: 寒烟
//  * 日期: 2018/5/30
//  *
//  * 个人博客：   http://www.cnblogs.com/ansiboy/
//  * GITHUB:     http://github.com/ansiboy
//  * QQ 讨论组：  119038574
//  * 
//  ********************************************************************************/
// namespace jueying {
//     let h = React.createElement;
//     export interface ControlProps<T> extends React.Props<T> {
//         id?: string,
//         name?: string,
//         className?: string,
//         style?: React.CSSProperties,
//         tabIndex?: number,
//         componentName?: string,
//         designMode?: boolean,
//         selected?: boolean,
//     }
//     export interface ControlState {
//         selected: boolean
//     }
//     let customControlTypes: { [key: string]: React.ComponentClass<any> | string } = {}
//     export abstract class Control<P extends ControlProps<any>, S> extends React.Component<P, S> {
//         private _designer: PageDesigner | null = null;
//         private originalComponentDidMount: (() => void) | undefined;
//         private originalRender: () => React.ReactNode;
//         // private static allInstance: { [key: string]: Control<any, any> } = {};
//         static tabIndex = 1;
//         // static componentsDir = 'components';
//         static connectorElementClassName = 'component-container';
//         // static componentTypeName = 'data-component-name';
//         protected hasCSS = false;
//         // pageView: PageView
//         element: HTMLElement;
//         constructor(props: P) {
//             super(props);
//             console.assert((this.props as any).id != null);
//             this.originalComponentDidMount = this.componentDidMount;
//             this.componentDidMount = this.myComponentDidMount;
//             console.assert(this.props.id, 'id is null or empty')
//         }
//         get id(): string {
//             let id = (this.props as any).id;
//             console.assert(id);
//             return id;
//         }
//         get isDesignMode(): boolean {
//             if (this.props.designMode == null)
//                 return this.designer != null;
//             return this.props.designMode as boolean;
//         }
//         get componentName() {
//             var componentName = (this.constructor as any)['componentName'];
//             console.assert(componentName != null)
//             return componentName;
//         }
//         get designer() {
//             return this._designer;
//         }
//         static htmlDOMProps(props: any) {
//             let result: { [key: string]: any } = {};
//             if (!props) {
//                 return result;
//             }
//             let keys = ['id', 'style', 'className', 'onClick'];
//             for (let key in props) {
//                 if (keys.indexOf(key) >= 0) {
//                     result[key] = props[key];
//                 }
//             }
//             return result;
//         }
//         protected async loadControlCSS() {
//             let componentName = this.componentName;
//             console.assert(componentName != null);
//             let path = `${constants.componentsDir}/${componentName}/control`;
//             requirejs([`less!${path}`])
//         }
//         private myComponentDidMount() {
//             if (this.originalComponentDidMount)
//                 this.originalComponentDidMount();
//             if (this.hasCSS) {
//                 this.loadControlCSS();
//             }
//         }
//         // Element(child: React.ReactElement<any>): React.ReactElement<any> | null
//         // Element(props: any, element: React.ReactElement<any>): React.ReactElement<any> | null
//         // Element(type: string, ...children: React.ReactElement<any>[]): React.ReactElement<any> | null
//         // Element(type: string, props: ControlProps<this>, ...children: React.ReactElement<any>[]): React.ReactElement<any> | null
//         // Element(type: any, props?: any, ...children: any[]): React.ReactElement<any> | null {
//         //     if (typeof type == 'string' && typeof (props) == 'object' && !React.isValidElement(props)) {
//         //     }
//         //     else if (typeof type == 'string' && (props == null || typeof (props) == 'object' && React.isValidElement(props) ||
//         //         typeof (props) == 'string')) {
//         //         children = children || [];
//         //         if (props)
//         //             children.unshift(props);
//         //         props = {};
//         //         if (children.length == 0)
//         //             children = null as any;
//         //     }
//         //     else if (typeof type == 'object' && React.isValidElement(type) && props == null) {
//         //         children = [type];
//         //         type = 'div';
//         //         props = {};
//         //     }
//         //     else if (typeof type == 'object' && !React.isValidElement(type) && React.isValidElement(props)) {
//         //         children = [props];
//         //         props = type;
//         //         type = 'div';
//         //     }
//         //     else {
//         //         throw new Error('not implement');
//         //     }
//         //     if (this.props.id)
//         //         props.id = this.props.id;
//         //     if (this.props.style) {
//         //         props.style = props.style ? Object.assign(this.props.style, props.style || {}) : this.props.style;
//         //     }
//         //     let className = ''
//         //     if (this.props.className) {
//         //         className = this.props.className
//         //     }
//         //     if (this.props.selected) {
//         //         className = className + ' ' + classNames.controlSelected
//         //     }
//         //     if (className)
//         //         props.className = className;
//         //     if (this.props.tabIndex)
//         //         props.tabIndex = this.props.tabIndex;
//         //     else
//         //         props.tabIndex = Control.tabIndex++
//         //     if (this.isDesignMode && typeof type == 'string') {
//         //         let func = (e: React.MouseEvent<any>) => {
//         //             console.log(`event type:${event.type}`)
//         //             let selectedControlIds = this.designer.selectedControlIds //[this.id]
//         //             //========================================================================
//         //             // 如果是多个 click 事件选中
//         //             if (selectedControlIds.length > 1 && event.type == 'react-mousedown') {
//         //                 return
//         //             }
//         //             //========================================================================
//         //             if (e.ctrlKey) {
//         //                 if (selectedControlIds.indexOf(this.id) >= 0) {
//         //                     selectedControlIds = selectedControlIds.filter(o => o != this.id)
//         //                 }
//         //                 else {
//         //                     selectedControlIds.push(this.id)
//         //                 }
//         //             }
//         //             else {
//         //                 selectedControlIds = [this.id]
//         //             }
//         //             console.assert(this.designer != null)
//         //             this.designer.selectControl(selectedControlIds)
//         //             e.stopPropagation();
//         //         }
//         //         (props as React.DOMAttributes<any>).onMouseDown = func;
//         //         (props as React.DOMAttributes<any>).onClick = func;
//         //     }
//         //     let originalRef = props.ref;
//         //     props.ref = (e: any) => {
//         //         if (originalRef) {
//         //             originalRef(e);
//         //         }
//         //         if (e == null)
//         //             return
//         //         this.element = e
//         //     };
//         //     return ControlFactory.createElement(this, type, props, ...children);
//         // }
//         // private static render() {
//         //     let self = this as any as Control<any, any>;
//         //     return <DesignerContext.Consumer>
//         //         {
//         //             context => {
//         //                 self._designer = context.designer;
//         //                 return <PageViewContext.Consumer>
//         //                     {pageViewContext => {
//         //                         self.pageView = pageViewContext.pageView
//         //                         if (typeof self.originalRender != 'function')
//         //                             return null;
//         //                         let h = (type: string | React.ComponentClass<any>, props: ControlProps<any>, ...children: any[]) =>
//         //                             ControlFactory.createElement(self, type, props, ...children);
//         //                         return (self.originalRender as Function)(h)
//         //                     }}
//         //                 </PageViewContext.Consumer>
//         //             }
//         //         }
//         //     </DesignerContext.Consumer >
//         // }
//         private static getControlType(componentName: string): Promise<React.ComponentClass<any>> {
//             return new Promise<React.ComponentClass<any>>((resolve, reject) => {
//                 let controlType = customControlTypes[componentName];
//                 if (typeof controlType != 'string') {
//                     resolve(controlType);
//                     return;
//                 }
//                 let controlPath = controlType;
//                 requirejs([controlPath],
//                     (exports2: any) => {
//                         let controlType: React.ComponentClass = exports2['default'];
//                         if (controlType == null)
//                             throw new Error(`Default export of file '${controlPath}' is null.`);
//                         (controlType as any)['componentName'] = componentName;
//                         customControlTypes[componentName] = controlType;
//                         resolve(controlType);
//                     },
//                     (err: Error) => reject(err)
//                 )
//             })
//         }
//         static loadTypes(elementData: ElementData) {
//             if (!elementData) throw Errors.argumentNull('elementData');
//             let stack = new Array<ElementData>();
//             stack.push(elementData);
//             let ps = new Array<Promise<any>>();
//             while (stack.length > 0) {
//                 let item = stack.pop();
//                 if (item == null)
//                     continue
//                 let componentName = item.type;
//                 ps.push(this.getControlType(componentName));
//                 let children = item.children || [];
//                 for (let i = 0; i < children.length; i++)
//                     stack.push(children[i]);
//             }
//             return Promise.all(ps);
//         }
//         // static getInstance(id: string) {
//         //     if (!id) throw Errors.argumentNull('id');
//         //     return this.allInstance[id];
//         // }
//         // static addInstance(id: string, instance: React.Component) {
//         //     this.allInstance[id] = instance as any
//         // }
//         // static create(args: ElementData): React.ReactElement<any> | null {
//         //     return ControlFactory.toReactElement(args);
//         // }
//     }
// }
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
var jueying;
(function (jueying) {
    class Callback {
        constructor() {
            this.funcs = new Array();
        }
        add(func) {
            this.funcs.push(func);
        }
        remove(func) {
            this.funcs = this.funcs.filter(o => o != func);
        }
        fire(args) {
            this.funcs.forEach(o => o(args));
        }
        static create() {
            return new Callback();
        }
    }
    jueying.Callback = Callback;
    class PageDesigner extends React.Component {
        constructor(props) {
            super(props);
            this._selectedControlIds = [];
            this.controlSelected = Callback.create();
            this.controlRemoved = Callback.create();
            this.designtimeComponentDidMount = Callback.create();
            this.componentUpdated = Callback.create();
            this.names = new Array();
            this.initSelectedIds(props.pageData);
            this.state = { pageData: props.pageData };
            this.designtimeComponentDidMount.add((args) => {
                console.log(`this:designer event:controlComponentDidMount`);
            });
        }
        initSelectedIds(pageData) {
            if (pageData == null) {
                this._selectedControlIds = [];
                return;
            }
            let stack = new Array();
            stack.push(pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                let props = item.props;
                if (props.selected) {
                    console.assert(props.id);
                    this._selectedControlIds.push(props.id);
                }
                (item.children || []).forEach(o => {
                    stack.push(o);
                });
            }
        }
        get pageData() {
            return this.state.pageData;
        }
        get selectedComponentIds() {
            return this._selectedControlIds;
        }
        static setComponentAttribute(typename, attr) {
            this.componentAttributes[typename] = attr;
        }
        updateControlProps(controlId, navPropsNames, value) {
            let controlDescription = this.findComponentData(controlId);
            if (controlDescription == null)
                return;
            console.assert(controlDescription != null);
            console.assert(navPropsNames != null, 'props is null');
            controlDescription.props = controlDescription.props || {};
            let obj = controlDescription.props;
            for (let i = 0; i < navPropsNames.length - 1; i++) {
                obj = obj[navPropsNames[i]] = obj[navPropsNames[i]] || {};
            }
            obj[navPropsNames[navPropsNames.length - 1]] = value;
            this.setState(this.state);
        }
        /**
         * 启用拖放操作，以便通过拖放图标添加控件
         */
        static enableDroppable(element, designer) {
            // let element = this.element
            console.assert(element != null);
            element.addEventListener('dragover', function (event) {
                event.preventDefault();
                event.stopPropagation();
                let componentName = event.dataTransfer.getData(jueying.constants.componentData);
                if (componentName)
                    event.dataTransfer.dropEffect = "copy";
                else
                    event.dataTransfer.dropEffect = "move";
                console.log(`dragover: left:${event.layerX} top:${event.layerX}`);
            });
            element.ondrop = (event) => {
                event.preventDefault();
                event.stopPropagation();
                let componentData = event.dataTransfer.getData(jueying.constants.componentData);
                if (!componentData) {
                    return;
                }
                let ctrl = JSON.parse(componentData);
                ctrl.props.style = ctrl.props.style || {};
                designer.pageData.props.style = designer.pageData.props.style || {};
                if (!ctrl.props.style.position) {
                    ctrl.props.style.position = designer.pageData.props.style.position;
                }
                if (ctrl.props.style.position == 'absolute') {
                    ctrl.props.style.left = event.layerX;
                    ctrl.props.style.top = event.layerY;
                }
                designer.appendComponent(element.id, ctrl);
            };
        }
        sortChildren(parentId, childIds) {
            if (!parentId)
                throw jueying.Errors.argumentNull('parentId');
            if (!childIds)
                throw jueying.Errors.argumentNull('childIds');
            let pageData = this.state.pageData;
            let parentControl = this.findComponentData(parentId);
            if (parentControl == null)
                throw new Error('Parent is not exists');
            console.assert(parentControl != null);
            console.assert(parentControl.children != null);
            console.assert((parentControl.children || []).length == childIds.length);
            let p = parentControl;
            parentControl.children = childIds.map(o => {
                let child = p.children.filter(a => a.props.id == o)[0];
                console.assert(child != null, `child ${o} is null`);
                return child;
            });
            this.setState({ pageData });
        }
        namedControl(control) {
            let props = control.props = control.props || {};
            if (!props.name) {
                let num = 0;
                let name;
                do {
                    num = num + 1;
                    name = `${control.type}${num}`;
                } while (this.names.indexOf(name) >= 0);
                this.names.push(name);
                props.name = name;
            }
            if (!props.id)
                props.id = jueying.guid();
            if (!control.children || control.children.length == 0) {
                return;
            }
            for (let i = 0; i < control.children.length; i++) {
                this.namedControl(control.children[i]);
            }
        }
        /** 添加控件 */
        appendComponent(parentId, childControl, childIds) {
            if (!parentId)
                throw jueying.Errors.argumentNull('parentId');
            if (!childControl)
                throw jueying.Errors.argumentNull('childControl');
            this.namedControl(childControl);
            let parentControl = this.findComponentData(parentId);
            if (parentControl == null)
                throw new Error('Parent is not exists');
            console.assert(parentControl != null);
            parentControl.children = parentControl.children || [];
            parentControl.children.push(childControl);
            if (childIds)
                this.sortChildren(parentId, childIds);
            else {
                let { pageData } = this.state;
                this.setState({ pageData });
            }
            this.selectComponent(childControl.props.id);
        }
        /** 设置控件位置 */
        setControlPosition(controlId, left, top) {
            let controlData = this.findComponentData(controlId);
            if (!controlData)
                throw new Error(`Control ${controlId} is not exits.`);
            let style = controlData.props.style = (controlData.props.style || {});
            style.left = left;
            style.top = top;
            let { pageData } = this.state;
            this.setState({ pageData });
        }
        setControlsPosition(positions) {
            positions.forEach(o => {
                let { controlId, left, top } = o;
                let controlData = this.findComponentData(controlId);
                if (!controlData)
                    throw new Error(`Control ${controlId} is not exits.`);
                let style = controlData.props.style = (controlData.props.style || {});
                style.left = left;
                style.top = top;
                let { pageData } = this.state;
                this.setState({ pageData });
            });
        }
        /**
         * 选择指定的控件
         * @param control 指定的控件
         */
        selectComponent(controlIds) {
            if (typeof controlIds == 'string')
                controlIds = [controlIds];
            var stack = [];
            stack.push(this.pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                let isSelectedControl = controlIds.indexOf(item.props.id) >= 0;
                item.props.selected = isSelectedControl;
                let children = item.children || [];
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i]);
                }
            }
            this._selectedControlIds = controlIds;
            controlIds.map(id => this.findComponentData(id)).forEach(o => {
                let props = o.props;
                props.selected = true;
            });
            this.setState({ pageData: this.pageData });
            this.controlSelected.fire(this.selectedComponentIds);
            //====================================================
            // 设置焦点，以便获取键盘事件
            this.element.focus();
            //====================================================
        }
        /** 移除控件 */
        removeControl(...controlIds) {
            let pageData = this.state.pageData;
            if (!pageData || !pageData.children || pageData.children.length == 0)
                return;
            controlIds.forEach(controlId => {
                this.removeControlFrom(controlId, pageData.children);
            });
            this._selectedControlIds = this._selectedControlIds.filter(id => controlIds.indexOf(id) < 0);
            this.setState({ pageData });
            this.controlRemoved.fire(controlIds);
        }
        /** 移动控件到另外一个控件容器 */
        moveControl(controlId, parentId, childIds) {
            let control = this.findComponentData(controlId);
            if (control == null)
                throw new Error(`Cannt find control by id ${controlId}`);
            console.assert(control != null, `Cannt find control by id ${controlId}`);
            let pageData = this.state.pageData;
            console.assert(pageData.children);
            this.removeControlFrom(controlId, pageData.children);
            this.appendComponent(parentId, control, childIds);
        }
        removeControlFrom(controlId, collection) {
            let controlIndex = null;
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
                        let isRemoved = this.removeControlFrom(controlId, o.children);
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
        findComponentData(controlId) {
            let pageData = this.state.pageData;
            if (!pageData)
                throw jueying.Errors.pageDataIsNull();
            let stack = new Array();
            stack.push(pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                if (item == null)
                    continue;
                if (item.props.id == controlId)
                    return item;
                let children = (item.children || []).filter(o => typeof o == 'object');
                stack.push(...children);
            }
            return null;
        }
        onKeyDown(e) {
            const DELETE_KEY_CODE = 46;
            if (e.keyCode == DELETE_KEY_CODE) {
                if (this._selectedControlIds.length == 0)
                    return;
                this.removeControl(...this._selectedControlIds);
            }
        }
        /**
         * 对设计时元素进行处理
         * 1. 可以根据设定是否移到该元素
         * 2. 可以根据设定是否允许添加组件到该元素
         * @param element 设计时元素
         * @param attr
         */
        designtimeBehavior(element, attr) {
            if (!element)
                throw jueying.Errors.argumentNull('element');
            if (!attr)
                throw jueying.Errors.argumentNull('args');
            console.assert(attr.container != null);
            console.assert(attr.movable != null);
            if (attr.container) {
                PageDesigner.enableDroppable(element, this);
            }
            if (attr.movable) {
                console.assert(element != null);
                PageDesigner.draggableElement(element, this);
            }
        }
        static draggableElement(element, designer) {
            if (!element)
                throw jueying.Errors.argumentNull('element');
            if (!element)
                throw jueying.Errors.argumentNull('designer');
            let timeStart;
            let elementID = element.id;
            console.assert(elementID);
            $(element)
                .drag("init", function (ev) {
                let e = ev.currentTarget;
                if ($(this).is(`.${jueying.classNames.componentSelected}`))
                    return $(`.${jueying.classNames.componentSelected}`);
            })
                .drag('start', function (ev) {
                timeStart = Date.now();
            })
                .drag(function (ev, dd) {
                ev.preventDefault();
                ev.stopPropagation();
                setPosition(ev, dd, this);
            }, { click: true })
                .drag('end', function (ev, dd) {
                let designerPosition = $(designer.element).offset();
                let left = dd.offsetX - designerPosition.left;
                let top = dd.offsetY - designerPosition.top;
                designer.setControlPosition(ev.currentTarget.id, left, top);
            })
                .click(function (ev, dd) {
                ev.preventDefault();
                ev.stopPropagation();
                console.log(`draggableElement drag end: ${timeStart}`);
                let t = Date.now() - (timeStart || Date.now());
                timeStart = null;
                if (t > 300) {
                    return;
                }
                console.log(`time interval:` + t);
                let e = ev.currentTarget;
                let element = ev.currentTarget;
                let elementID = element.id;
                if (!ev.ctrlKey) {
                    designer.selectComponent(element.id);
                    return;
                }
                console.assert(elementID);
                if (designer._selectedControlIds.indexOf(elementID) >= 0) {
                    designer._selectedControlIds = designer._selectedControlIds.filter(o => o != elementID);
                }
                else {
                    designer._selectedControlIds.push(elementID);
                }
                designer.selectComponent(designer._selectedControlIds);
            });
            function setPosition(ev, dd, element) {
                let designerPosition = $(designer.element).offset();
                let left = dd.offsetX - designerPosition.left;
                let top = dd.offsetY - designerPosition.top;
                console.log(['ev.offsetX, ev.offsetY', ev.offsetX, ev.offsetY]);
                console.log(['dd.offsetX, dd.offsetY', dd.offsetX, dd.offsetY]);
                console.log(ev);
                console.log(dd);
                $(element).css({
                    top, left
                });
            }
        }
        createDesignTimeElement(type, props, ...children) {
            console.assert(props.id);
            if (props.id != null)
                props.key = props.id;
            if (type == 'a' && props.href) {
                props.href = 'javascript:';
            }
            else if (type == 'input' || type == 'button') {
                delete props.onClick;
                props.readOnly = true;
            }
            let allowWrapper = true;
            let tagName = type;
            if (tagName == 'html' || tagName == 'head' || tagName == 'body' ||
                tagName == 'thead' || tagName == 'tbody' || tagName == 'tfoot' || tagName == 'th' || tagName == 'tr' || tagName == 'td') {
                allowWrapper = false;
            }
            if (allowWrapper) {
                let style = props.style || {};
                let { top, left, position, width, height } = style;
                delete style.left;
                delete style.top;
                let wrapperProps = {
                    id: props.id,
                    className: props.selected ? `${jueying.classNames.componentSelected} ${jueying.classNames.component}` : jueying.classNames.component,
                    style: { top, left, position, width, height },
                    ref: (e) => {
                        if (!e)
                            return;
                        if (e.getAttribute('data-behavior')) {
                            return;
                        }
                        e.setAttribute('data-behavior', 'behavior');
                        let typename = typeof type == 'string' ? type : type.name;
                        let attr = Object.assign(PageDesigner.defaultComponentAttribute, PageDesigner.componentAttributes[typename] || {});
                        this.designtimeBehavior(e, attr);
                    }
                };
                return React.createElement("div", Object.assign({}, wrapperProps),
                    React.createElement("div", { style: { height: 12, width: 12, top: -6, left: 8, border: 'solid 1px black', position: 'absolute' } }),
                    React.createElement(type, props, ...children));
            }
            props.ref = (e) => {
                if (!e)
                    return;
                e.onclick = (ev) => {
                    ev.stopPropagation();
                    this.selectComponent(e.id);
                };
            };
            let element = React.createElement(type, props, ...children);
            return element;
        }
        componentWillReceiveProps(props) {
            this.initSelectedIds(props.pageData);
            this.setState({ pageData: props.pageData });
        }
        componentDidUpdate() {
            this.componentUpdated.fire(this);
        }
        render() {
            let designer = this;
            let { pageData } = this.state;
            let result = React.createElement("div", { className: "designer", tabIndex: 1, ref: e => {
                    if (!e)
                        return;
                    this.element = e || this.element;
                }, onKeyDown: (e) => this.onKeyDown(e) },
                React.createElement(jueying.DesignerContext.Provider, { value: { designer } }, (() => {
                    let pageView = pageData ? jueying.core.createElement(pageData, this.createDesignTimeElement.bind(this)) : null;
                    return pageView;
                })()));
            return result;
        }
    }
    PageDesigner.componentAttributes = {
        'table': { container: false, movable: true },
        'thead': { container: false, movable: false },
        'tbody': { container: false, movable: false },
        'tfoot': { container: false, movable: false },
        'tr': { container: false, movable: false },
        'td': { container: true, movable: false },
        'img': { container: false, movable: true },
        'div': { container: true, movable: true },
    };
    PageDesigner.defaultComponentAttribute = { container: false, movable: true };
    jueying.PageDesigner = PageDesigner;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class PropEditor extends React.Component {
        constructor(props) {
            super(props);
            this.state = { value: props.value };
        }
        componentWillReceiveProps(props) {
            this.setState({ value: props.value });
        }
    }
    jueying.PropEditor = PropEditor;
    class TextInput extends PropEditor {
        render() {
            let { value } = this.state;
            return React.createElement("input", { className: 'form-control', value: value || '', onChange: e => {
                    this.setState({ value: e.target.value });
                    this.props.onChange(e.target.value);
                } });
        }
    }
    jueying.TextInput = TextInput;
    function dropdown(items, emptyText) {
        return class Dropdown extends PropEditor {
            render() {
                let { value } = this.state;
                return React.createElement("select", { className: 'form-control', value: value || '', onChange: e => {
                        value = e.target.value;
                        this.setState({ value });
                        this.props.onChange(value);
                    } },
                    emptyText ? React.createElement("option", { value: "" }, emptyText) : null,
                    Object.getOwnPropertyNames(items).map(o => React.createElement("option", { key: o, value: o }, items[o])));
            }
        };
    }
    jueying.dropdown = dropdown;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        extentions.guid = guid;
        function isEquals(obj1, obj2) {
            if ((obj1 == null && obj2 != null) || (obj1 != null && obj2 == null))
                return false;
            if (obj1 == null && obj2 == null)
                return true;
            var type = typeof obj1;
            if (type == 'number' || type == 'string' || obj1 instanceof Date) {
                return obj1 == obj2;
            }
            if (Array.isArray(obj1)) {
                if (!Array.isArray(obj2))
                    return false;
                if (obj1.length != obj2.length)
                    return false;
                for (let i = 0; i < obj1.length; i++) {
                    if (!isEquals(obj1[i], obj2[i])) {
                        return false;
                    }
                }
                return true;
            }
            let keys1 = Object.getOwnPropertyNames(obj1)
                .filter(o => !skipField(obj1, o))
                .sort();
            let keys2 = Object.getOwnPropertyNames(obj2)
                .filter(o => !skipField(obj2, o))
                .sort();
            if (!isEquals(keys1, keys2))
                return false;
            for (let i = 0; i < keys1.length; i++) {
                let key = keys1[i];
                let value1 = obj1[key];
                let value2 = obj2[key];
                if (!isEquals(value1, value2)) {
                    return false;
                }
            }
            return true;
        }
        extentions.isEquals = isEquals;
        function skipField(obj, field) {
            return typeof obj[field] == 'function';
        }
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        let style = { width: '100%', height: '100%', minWidth: 'unset' };
        // let template0: DocumentData = {
        //     pageData: {
        //         type: 'PageView',
        //         props: {
        //             id: guid(),
        //             className: "page-view",
        //             style,
        //             componentName: "PageView"
        //         },
        //         children: [
        //             {
        //                 type: "ControlPlaceholder",
        //                 props: {
        //                     "emptyText": "页面中部，可以从工具栏拖拉控件到这里",
        //                     id: guid(),
        //                     htmlTag: 'section',
        //                     style: { height: '100%', margin: 0 }
        //                 } as any,
        //                 children: [
        //                     {
        //                         type: 'TextHeader',
        //                         props: {
        //                             id: guid(),
        //                             text: '商品订购',
        //                             size: 3,
        //                         },
        //                     },
        //                     {
        //                         type: 'ValueInput',
        //                         props: {
        //                             id: guid(),
        //                             dataField: '商品名称'
        //                         }
        //                     },
        //                     {
        //                         type: 'ValueInput',
        //                         props: {
        //                             id: guid(),
        //                             dataField: '商品数量'
        //                         }
        //                     },
        //                     {
        //                         type: 'ValueInput',
        //                         props: {
        //                             id: guid(),
        //                             dataField: '收件人'
        //                         }
        //                     },
        //                     {
        //                         type: 'ValueInput',
        //                         props: {
        //                             id: guid(),
        //                             dataField: '联系电话'
        //                         }
        //                     },
        //                     {
        //                         type: 'ValueInput',
        //                         props: {
        //                             id: guid(),
        //                             dataField: '收件地址'
        //                         }
        //                     },
        //                     {
        //                         type: 'SubmitButton',
        //                         props: {
        //                             id: guid(),
        //                             text: '提交订单',
        //                             style: {
        //                                 width: '100%'
        //                             }
        //                         }
        //                     },
        //                 ]
        //             }
        //         ]
        //     },
        //     name: '商品订购'
        // }
        let template1 = {
            pageData: {
                type: 'PageView',
                props: {
                    "id": extentions.guid(),
                    "className": "page-view",
                    style,
                    "componentName": "PageView"
                },
                "children": [
                    {
                        type: "ControlPlaceholder",
                        props: {
                            "emptyText": "页面中部，可以从工具栏拖拉控件到这里",
                            "key": "181c33a2-e2fd-9d79-ae08-c8a97cfb1f04",
                            "id": "181c33a2-e2fd-9d79-ae08-c8a97cfb1f04",
                            htmlTag: 'section',
                            style: { height: '100%', margin: 0 }
                        }
                    }
                ]
            },
            name: '空白模板(流式定位)'
        };
        let template2 = {
            pageData: {
                type: 'PageView',
                props: {
                    id: extentions.guid(),
                    className: "page-view",
                    style,
                    componentName: "PageView",
                    layout: 'absolute'
                }
                // children: [
                //     {
                //         type: "ControlPlaceholder",
                //         props: {
                //             id: guid(),
                //             emptyText: "页面中部，可以从工具栏拖拉控件到这里",
                //             htmlTag: 'section',
                //             style: { height: '100%', margin: 0 }
                //         } as any
                //     }
                // ]
            },
            name: '空白模板(绝对定位)'
        };
        extentions.templates = [template1, template2,];
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
/// <reference path="templates.tsx"/>
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        class DesignerFramework extends React.Component {
            constructor(props) {
                super(props);
                this.names = [];
                this.state = {
                    changed: false,
                    canUndo: false,
                    canRedo: false
                };
            }
            /** 对控件进行命名 */
            namedControl(control) {
                console.assert(control.props);
                let props = control.props;
                if (!props.name) {
                    let num = 0;
                    let name;
                    do {
                        num = num + 1;
                        name = `${control.type}${num}`;
                    } while (this.names.indexOf(name) >= 0);
                    this.names.push(name);
                    props.name = name;
                }
                if (!props.id)
                    props.id = extentions.guid();
                if (!control.children || control.children.length == 0) {
                    return;
                }
                for (let i = 0; i < control.children.length; i++) {
                    let child = control.children[i];
                    if (typeof child != 'string')
                        this.namedControl(child);
                }
            }
            createButtons(pageDocument, buttonClassName) {
                buttonClassName = buttonClassName || 'btn btn-default';
                let isChanged = pageDocument ? pageDocument.isChanged : false;
                return [
                    React.createElement("button", { className: buttonClassName, disabled: !isChanged, onClick: () => this.save() },
                        React.createElement("i", { className: "icon-save" }),
                        React.createElement("span", null, "\u4FDD\u5B58")),
                    React.createElement("button", { className: buttonClassName, onClick: () => this.redo() },
                        React.createElement("i", { className: "icon-repeat" }),
                        React.createElement("span", null, "\u91CD\u505A")),
                    React.createElement("button", { className: buttonClassName, onClick: () => this.undo() },
                        React.createElement("i", { className: "icon-undo" }),
                        React.createElement("span", null, "\u64A4\u9500")),
                    React.createElement("button", { className: buttonClassName },
                        React.createElement("i", { className: "icon-eye-open" }),
                        React.createElement("span", null, "\u9884\u89C8")),
                    React.createElement("button", { className: buttonClassName, onClick: () => this.newFile() },
                        React.createElement("i", { className: "icon-file" }),
                        React.createElement("span", null, "\u65B0\u5EFA")),
                    React.createElement("button", { className: buttonClassName, onClick: () => this.open() },
                        React.createElement("i", { className: "icon-folder-open" }),
                        React.createElement("span", null, "\u6253\u5F00"))
                ];
            }
            get storage() {
                if (this._storage == null)
                    this._storage = new extentions.LocalDocumentStorage();
                return this._storage;
            }
            static get dialogsElement() {
                let id = 'designer-framework-dialogs';
                let element = document.getElementById(id);
                if (!element) {
                    element = document.createElement('div');
                    element.id = id;
                    document.body.appendChild(element);
                }
                return element;
            }
            //======================================================
            // Virtual Method
            undo() {
                // this.pageDesigner.undo();
            }
            redo() {
                // this.pageDesigner.redo();
            }
            save() {
                return __awaiter(this, void 0, void 0, function* () {
                    let { activeDocument, pageDocuments } = this.state;
                    let pageDocument = activeDocument; //pageDocuments[activeDocumentIndex];
                    console.assert(pageDocument != null);
                    pageDocument.save();
                    this.setState({ pageDocuments });
                });
            }
            createDocuemnt(fileName, pageData, isNew) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.assert(fileName);
                    let { pageDocuments } = this.state;
                    let documentStorage = this.storage;
                    let pageDocument = isNew ? extentions.PageDocument.new(documentStorage, fileName, pageData) :
                        yield extentions.PageDocument.load(documentStorage, fileName);
                    pageDocuments = pageDocuments || [];
                    pageDocuments.push(pageDocument);
                    this.setState({
                        pageDocuments,
                        activeDocument: pageDocuments[pageDocuments.length - 1]
                    });
                });
            }
            fetchTemplates() {
                return __awaiter(this, void 0, void 0, function* () {
                    let templates = this.props.templates;
                    return { items: templates, count: templates.length };
                });
            }
            newFile() {
                return __awaiter(this, void 0, void 0, function* () {
                    extentions.TemplateDialog.show({
                        fetch: () => this.fetchTemplates(),
                        requiredFileName: true,
                        callback: (tmp, fileName) => {
                            this.createDocuemnt(fileName, tmp.pageData, true);
                        }
                    });
                });
            }
            open() {
                extentions.TemplateDialog.show({
                    fetch: (pageIndex, pageSize) => __awaiter(this, void 0, void 0, function* () {
                        let result = yield this.storage.list(pageIndex, pageSize);
                        let items = result.items.map(a => ({ name: a[0], pageData: a[1] }));
                        let count = result.count;
                        return { items, count };
                    }),
                    callback: (tmp) => {
                        let fileName = tmp.name;
                        let docs = this.state.pageDocuments || [];
                        let existDoc = docs.filter(o => o.name == tmp.name)[0];
                        if (existDoc) {
                            let index = docs.indexOf(existDoc);
                            this.activeDocument(index);
                            return;
                        }
                        this.createDocuemnt(fileName, tmp.pageData, false);
                    }
                });
            }
            activeDocument(index) {
                let { pageDocuments } = this.state;
                let doc = pageDocuments[index];
                console.assert(doc != null);
                this.setState({ activeDocument: doc });
                setTimeout(() => {
                    let pageViewId = doc.pageData.props.id;
                    console.assert(pageViewId != null, 'pageView id is null');
                    console.assert(doc.pageData.type == 'PageView');
                    this.pageDesigner.selectComponent(pageViewId);
                }, 50);
            }
            setState(state) {
                super.setState(state);
            }
            closeDocument(index) {
                let { pageDocuments, activeDocument } = this.state;
                console.assert(pageDocuments != null);
                let doc = pageDocuments[index];
                console.assert(doc != null);
                let close = () => {
                    pageDocuments.splice(index, 1);
                    let activeDocumentIndex = index > 0 ? index - 1 : 0;
                    let activeDocument = pageDocuments[activeDocumentIndex];
                    this.setState({ pageDocuments, activeDocument });
                };
                if (!doc.isChanged) {
                    close();
                    return;
                }
                ui.confirm({
                    title: '提示',
                    message: '该页面尚未保存，是否保存?',
                    confirm: () => __awaiter(this, void 0, void 0, function* () {
                        yield doc.save();
                        close();
                    }),
                    cancle: () => {
                        close();
                    }
                });
            }
            componentDidMount() {
            }
            designerRef(e) {
                if (!e)
                    return;
                this.pageDesigner = e || this.pageDesigner;
                this.pageDesigner.controlSelected.add((controlIds) => {
                    let controlDatas = controlIds.map(o => this.pageDesigner.findComponentData(o));
                    this.editorPanel.setControls(controlDatas, this.pageDesigner);
                });
                this.pageDesigner.componentUpdated.add((sender) => {
                    console.assert(this.toolbarElement);
                    this.renderToolbar(this.toolbarElement);
                    let controlDatas = sender.selectedComponentIds.map(o => this.pageDesigner.findComponentData(o));
                    this.editorPanel.setControls(controlDatas, this.pageDesigner);
                });
            }
            renderToolbar(element) {
                let pageDocument = this.state.activeDocument;
                let buttons = this.createButtons(pageDocument);
                let { title } = this.props;
                ReactDOM.render(React.createElement(React.Fragment, null,
                    React.createElement("li", { className: "pull-left" },
                        React.createElement("h3", null, title || '')),
                    buttons.map((o, i) => React.createElement("li", { key: i, className: "pull-right" }, o))), element);
            }
            render() {
                let { activeDocument, pageDocuments } = this.state;
                let { components } = this.props;
                pageDocuments = pageDocuments || [];
                let pageDocument = activeDocument;
                return React.createElement("div", { className: "designer-form" },
                    React.createElement("ul", { className: "toolbar clearfix", ref: e => {
                            if (!e)
                                return;
                            this.toolbarElement = e;
                            this.renderToolbar(this.toolbarElement);
                        } }),
                    React.createElement("div", { className: "main-panel" },
                        React.createElement("ul", { className: "nav nav-tabs", style: { display: pageDocuments.length == 0 ? 'none' : null } }, pageDocuments.map((o, i) => React.createElement("li", { key: i, role: "presentation", className: o == activeDocument ? 'active' : null, onClick: () => this.activeDocument(i) },
                            React.createElement("a", { href: "javascript:" },
                                o.name,
                                React.createElement("i", { className: "pull-right icon-remove", style: { cursor: 'pointer' }, onClick: (e) => {
                                        e.cancelable = true;
                                        e.stopPropagation();
                                        this.closeDocument(i);
                                    } }))))),
                        pageDocument ?
                            React.createElement(jueying.PageDesigner, { pageData: pageDocument.pageData, ref: e => this.designerRef(e) }) : null),
                    React.createElement(jueying.ComponentToolbar, { className: "component-panel", componets: components }),
                    React.createElement(jueying.EditorPanel, { emptyText: "未选中控件，点击页面控件，可以编辑选中控件的属性", ref: e => this.editorPanel = e || this.editorPanel }));
            }
        }
        DesignerFramework.defaultProps = {
            components: [], templates: extentions.templates
        };
        extentions.DesignerFramework = DesignerFramework;
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        class LocalDocumentStorage {
            constructor() {
                debugger;
            }
            list(pageIndex, pageSize) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (pageIndex == null)
                        throw jueying.Errors.argumentNull('pageIndex');
                    if (pageSize == null)
                        throw jueying.Errors.argumentNull('pageSize');
                    let allItems = new Array();
                    for (let i = 0; i < localStorage.length; i++) {
                        let key = localStorage.key(i);
                        if (!key.startsWith(LocalDocumentStorage.prefix)) {
                            continue;
                        }
                        let name = key.substr(LocalDocumentStorage.prefix.length);
                        let value = localStorage[key];
                        let doc = JSON.parse(value);
                        allItems.push([name, doc]);
                    }
                    let count = allItems.length;
                    let items = allItems.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
                    return { items, count };
                });
            }
            load(name) {
                return __awaiter(this, void 0, void 0, function* () {
                    let key = `${LocalDocumentStorage.prefix}${name}`;
                    let text = localStorage.getItem(key);
                    if (text == null)
                        return null;
                    return JSON.parse(text);
                });
            }
            save(name, pageData) {
                return __awaiter(this, void 0, void 0, function* () {
                    let key = `${LocalDocumentStorage.prefix}${name}`;
                    let value = JSON.stringify(pageData);
                    localStorage.setItem(key, value);
                });
            }
            remove(name) {
                return __awaiter(this, void 0, void 0, function* () {
                    let key = `${LocalDocumentStorage.prefix}${name}`;
                    localStorage.removeItem(key);
                });
            }
        }
        LocalDocumentStorage.prefix = 'pdc_';
        extentions.LocalDocumentStorage = LocalDocumentStorage;
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        class PageDocument {
            constructor(fileName, storage, pageData, isNew) {
                this.storage = storage;
                this._pageData = pageData;
                isNew = isNew == null ? false : isNew;
                if (isNew)
                    this.originalPageData = { type: 'PageView', props: {} };
                else
                    this.originalPageData = JSON.parse(JSON.stringify(pageData));
                this.fileName = fileName;
            }
            save() {
                this.originalPageData = JSON.parse(JSON.stringify(this._pageData));
                return this.storage.save(this.fileName, this.originalPageData);
            }
            get isChanged() {
                let equals = extentions.isEquals(this.originalPageData, this._pageData);
                return !equals;
            }
            get name() {
                return this.fileName;
            }
            get pageData() {
                return this._pageData;
            }
            static load(storage, fileName) {
                return __awaiter(this, void 0, void 0, function* () {
                    // let storage = new LocalDocumentStorage()
                    let data = yield storage.load(fileName);
                    if (data == null) {
                        throw jueying.Errors.fileNotExists(fileName);
                    }
                    return new PageDocument(fileName, storage, data);
                });
            }
            static new(storage, fileName, init) {
                // let storage = new LocalDocumentStorage()
                return new PageDocument(fileName, storage, init, true);
            }
        }
        PageDocument.instances = {};
        extentions.PageDocument = PageDocument;
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        extentions.classNames = {
            componentSelected: `component-selected `,
            emptyTemplates: `empty-templates`,
            loadingTemplates: `loading-templates`,
            templateSelected: `template-selected`,
            templateDialog: `template-dialog`,
            emptyDocument: `empty-document`,
        };
        let templateDialog = {
            nameHeight: 40,
            fontSize: 22
        };
        let element = document.createElement('style');
        element.type = 'text/css';
        element.innerHTML = `
        .${extentions.classNames.componentSelected} {
            border: solid 1px #337ab7!important;
        }
        .${extentions.classNames.emptyTemplates} {
            padding:50px 0;
            text-align: center;
        }
        .${extentions.classNames.loadingTemplates} {
            padding:50px 0;
            text-align: center;
        }
        .${extentions.classNames.templateSelected} .page-view {
            border: solid 1px #337ab7!important;
        }
        .${extentions.classNames.templateDialog} .name {
            margin-top: -${templateDialog.nameHeight}px;
            height: ${templateDialog.nameHeight}px;
            font-size: ${templateDialog.fontSize}px;
            text-align: center;
            padding-top: 6px;
            background-color: black;
            opacity: 0.5;
        }
        .${extentions.classNames.templateDialog} .name span {
            color: white;
        }
        .${extentions.classNames.emptyDocument} {
            text-align: center;
            padding: 100px 0;
        }
        ul.nav-tabs li i {
            position: relative;
            top: 4px;
            right: -6px;
        }
    `;
        document.head.appendChild(element);
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
/// <reference path="comon.tsx"/>
var jueying;
(function (jueying) {
    var extentions;
    (function (extentions) {
        // let pd = jueying;
        class PageViewContainer extends React.Component {
            render() {
                let { phone_screen_width, phone_screen_height, scale } = PageViewContainer;
                let transform = `translateX(-${phone_screen_width * (1 - scale) / 2}px) translateY(-${phone_screen_height * (1 - scale) / 2}px) scale(${scale})`;
                let style = { width: phone_screen_width, height: phone_screen_height, minWidth: 'unset', transform };
                return React.createElement("div", { style: style }, this.props.children);
            }
        }
        PageViewContainer.phone_screen_width = 320;
        PageViewContainer.phone_screen_height = 568;
        PageViewContainer.scale = 0.6;
        PageViewContainer.phone_height = PageViewContainer.phone_screen_height * PageViewContainer.scale;
        PageViewContainer.phone_width = PageViewContainer.phone_screen_width * PageViewContainer.scale;
        const PAGE_SIZE = 3;
        class TemplateDialog extends React.Component {
            constructor(props) {
                super(props);
                this.state = { templates: null, pageIndex: 0, selectedTemplateIndex: 0, showFileNameInput: true };
            }
            selectTemplate(templateIndex) {
                this.setState({ selectedTemplateIndex: templateIndex });
            }
            confirm() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (this.state.showFileNameInput) {
                        let isValid = yield this.validator.check();
                        if (!isValid)
                            return Promise.reject();
                    }
                    if (this.callback) {
                        let { templates, selectedTemplateIndex, fileName } = this.state;
                        let template = templates[selectedTemplateIndex];
                        this.callback(template, fileName);
                        this.close();
                    }
                });
            }
            loadTemplates(pageIndex) {
                return __awaiter(this, void 0, void 0, function* () {
                    console.assert(this.fetchTemplates != null);
                    let tmps = yield this.fetchTemplates(pageIndex, PAGE_SIZE);
                    console.assert(tmps != null);
                    console.assert(tmps.count > 0);
                    this.setState({ templates: tmps.items, templatesCount: tmps.count });
                    this.currentPageIndex = pageIndex;
                });
            }
            componentDidMount() {
                this.validator = new dilu.FormValidator(dialog_element, { name: 'fileName', rules: [dilu.rules.required('请输入文件名')] });
            }
            showPage(pageIndex) {
                return __awaiter(this, void 0, void 0, function* () {
                    let result = yield this.fetchTemplates(pageIndex, PAGE_SIZE);
                    this.setState({ templates: result.items, templatesCount: result.count, pageIndex });
                });
            }
            render() {
                let { pageIndex, templates, templatesCount, selectedTemplateIndex, fileName, showFileNameInput, } = this.state;
                let height = PageViewContainer.phone_height;
                let width = PageViewContainer.phone_width;
                let margin = 15; // 间距
                let count = PAGE_SIZE;
                let dialog_content_width = width * count + margin * (count + 1);
                let pagingBar;
                if (templatesCount != null) {
                    let pagesCount = Math.ceil(templatesCount / PAGE_SIZE);
                    let children = [];
                    for (let i = 0; i < pagesCount; i++) {
                        children.push(React.createElement("li", { key: i, className: i == pageIndex ? 'active' : null },
                            React.createElement("a", { href: "javascript:", onClick: () => this.showPage(i) }, i + 1)));
                    }
                    pagingBar = h("ul", { className: 'pagination', style: { margin: 0 } }, children);
                }
                return React.createElement("div", { className: "modal-dialog" },
                    React.createElement("div", { className: "modal-content", style: { width: dialog_content_width } },
                        React.createElement("div", { className: "modal-header" },
                            React.createElement("button", { type: "button", className: "close", onClick: () => ui.hideDialog(dialog_element) },
                                React.createElement("span", { "aria-hidden": "true" }, "\u00D7")),
                            React.createElement("h4", { className: "modal-title" }, "\u9009\u62E9\u6A21\u677F")),
                        React.createElement("div", { className: "modal-body clearfix" },
                            React.createElement("div", { className: "form-group" }, templates == null ?
                                React.createElement("div", { className: extentions.classNames.loadingTemplates }, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D") :
                                templates.length == 0 ?
                                    React.createElement("div", { className: extentions.classNames.emptyTemplates }, "\u6682\u65E0\u6A21\u7248\u6570\u636E") :
                                    React.createElement(React.Fragment, null,
                                        templates.map((o, i) => React.createElement("div", { key: i, style: { width, height, float: i == 2 ? 'right' : 'left', margin: i == 1 ? '0 0 0 15px' : null }, onClick: () => this.selectTemplate(i), className: i == selectedTemplateIndex ? extentions.classNames.templateSelected : null },
                                            React.createElement(PageViewContainer, null,
                                                jueying.core.createElement(o.pageData),
                                                React.createElement("div", { className: "name" },
                                                    React.createElement("span", null, o.name))))),
                                        React.createElement("div", { className: "clearfix" }))),
                            showFileNameInput ? React.createElement("div", { className: "form-group", style: { marginBottom: 0 } },
                                React.createElement("label", { className: "pull-left" }, "\u6587\u4EF6\u540D"),
                                React.createElement("div", { style: { marginLeft: 100 } },
                                    React.createElement("input", { name: "fileName", className: "form-control", value: fileName || '', onChange: (e) => {
                                            fileName = e.target.value;
                                            this.setState({ fileName });
                                        } }))) : null),
                        React.createElement("div", { className: "modal-footer" },
                            React.createElement("div", { className: "pull-left" }, pagingBar),
                            React.createElement("div", { className: "pull-right" },
                                React.createElement("button", { className: "btn btn-primary", onClick: () => this.confirm() },
                                    React.createElement("i", { className: "icon-ok" }),
                                    React.createElement("span", null, "\u786E\u5B9A"))))));
            }
            open(requiredFileName) {
                requiredFileName == null ? true : requiredFileName;
                this.setState({
                    pageIndex: 0, selectedTemplateIndex: 0, fileName: '',
                    showFileNameInput: requiredFileName, templates: [],
                });
                this.currentPageIndex = null;
                ui.showDialog(dialog_element);
                this.loadTemplates(0);
            }
            close() {
                ui.hideDialog(dialog_element);
            }
            static show(args) {
                let { fetch, callback, requiredFileName } = args;
                defaultInstance.callback = callback;
                defaultInstance.fetchTemplates = fetch;
                defaultInstance.open(requiredFileName);
            }
        }
        extentions.TemplateDialog = TemplateDialog;
        let dialog_element = document.createElement('div');
        dialog_element.className = `modal fade ${extentions.classNames.templateDialog}`;
        document.body.appendChild(dialog_element);
        let defaultInstance;
        ReactDOM.render(React.createElement(TemplateDialog, { ref: (e) => defaultInstance = e || defaultInstance }), dialog_element);
    })(extentions = jueying.extentions || (jueying.extentions = {}));
})(jueying || (jueying = {}));
//# sourceMappingURL=jueying.js.map