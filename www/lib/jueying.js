var jueying;
(function (jueying) {
    jueying.constants = {
        componentsDir: 'components',
        connectorElementClassName: 'component-container',
        componentTypeName: 'data-component-name',
        componentData: 'component-data'
    };
    jueying.strings = {};
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
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    /**
     * 实现 JSON 对象的 UNDO，REDO 操作
     */
    class JSONUndoRedo {
        constructor(initData) {
            this.currentData = JSON.parse(JSON.stringify(initData));
            this.undoStack = [];
            this.redonStack = [];
        }
        get canUndo() {
            return this.undoStack.length > 0;
        }
        get canRedo() {
            return this.redonStack.length > 0;
        }
        setChangedData(changedData) {
            if (this.redonStack.length > 0)
                this.redonStack = [];
            let delta = jsondiffpatch.diff(this.currentData, changedData);
            if (delta == null)
                return;
            this.pushDelta(delta, this.undoStack);
            this.currentData = JSON.parse(JSON.stringify(changedData));
        }
        undo() {
            if (this.canUndo == false)
                return;
            let delta = this.undoStack.pop();
            this.currentData = jsondiffpatch.unpatch(this.currentData, delta);
            this.pushDelta(delta, this.redonStack);
            return JSON.parse(JSON.stringify(this.currentData));
        }
        redo() {
            if (this.canRedo == false)
                return;
            let delta = this.redonStack.pop();
            this.currentData = jsondiffpatch.patch(this.currentData, delta);
            this.pushDelta(delta, this.undoStack);
            return JSON.parse(JSON.stringify(this.currentData));
        }
        pushDelta(delta, stack) {
            //============================================================
            // 对于 delta ，必须 clone 一份数据再 push
            stack.push(JSON.parse(JSON.stringify(delta)));
            //============================================================
        }
    }
    jueying.JSONUndoRedo = JSONUndoRedo;
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
        componentWillReceiveProps(props) {
            this.setState({
                designer: props.designer,
            });
        }
        getEditors(designer) {
            if (designer == null) {
                return [];
            }
            // 各个控件相同的编辑器
            let commonPropEditorInfos = [];
            let componentDatas = designer.selectedComponents;
            for (let i = 0; i < componentDatas.length; i++) {
                let control = componentDatas[i];
                let className = control.type;
                let propEditorInfos = jueying.Component.getPropEditors(className);
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
            for (let i = 0; i < componentDatas.length; i++) {
                let control = componentDatas[i];
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
                        for (let i = 0; i < componentDatas.length; i++) {
                            let c = componentDatas[i];
                            console.assert(c.props.id);
                            designer.updateControlProps(c.props.id, propNames, value);
                        }
                    }
                });
                editors.push({ prop: propName, editor, group: propEditorInfo.group });
            }
            return editors;
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
            let { designer } = this.state;
            let editors = this.getEditors(designer);
            if (editors.length == 0) {
                return React.createElement("div", { className: "text-center" }, "\u6682\u65E0\u53EF\u7528\u7684\u5C5E\u6027");
            }
            let groupEditorsArray = [];
            for (let i = 0; i < editors.length; i++) {
                let group = editors[i].group || '';
                let groupEditors = groupEditorsArray.filter(o => o.group == group)[0];
                if (groupEditors == null) {
                    groupEditors = { group: editors[i].group, editors: [] };
                    groupEditorsArray.push(groupEditors);
                }
                groupEditors.editors.push({ prop: editors[i].prop, editor: editors[i].editor });
            }
            return React.createElement(React.Fragment, null, groupEditorsArray.map((g) => React.createElement("div", { key: g.group, className: "panel panel-default" },
                g.group ? React.createElement("div", { className: "panel-heading" }, jueying.strings[g.group] || g.group) : null,
                React.createElement("div", { className: "panel-body" }, g.editors.map((o, i) => React.createElement("div", { key: i, className: "form-group" },
                    React.createElement("label", null, jueying.strings[o.prop] || o.prop),
                    React.createElement("div", { className: "control" }, o.editor)))))));
        }
        get element() {
            return this._element;
        }
    }
    jueying.ComponentEditor = ComponentEditor;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class ComponentPanel extends React.Component {
        componentDraggable(toolItemElement, componentData) {
            console.assert(toolItemElement != null);
            toolItemElement.draggable = true;
            toolItemElement.addEventListener('dragstart', function (ev) {
                componentData.props = componentData.props || {};
                ev.dataTransfer.setData(jueying.constants.componentData, JSON.stringify(componentData));
                ev.dataTransfer.setData('mousePosition', JSON.stringify({ x: ev.offsetX, y: ev.offsetY }));
            });
        }
        static getComponentData(dataTransfer) {
            var str = dataTransfer.getData(jueying.constants.componentData);
            if (!str)
                return;
            return JSON.parse(str);
        }
        /** 获取光标在图标内的位置 */
        static mouseInnerPosition(dataTransfer) {
            let str = dataTransfer.getData('mousePosition');
            if (!str)
                return;
            return JSON.parse(str);
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
                            return React.createElement("li", Object.assign({}, props),
                                React.createElement("div", { className: "btn-link" },
                                    React.createElement("i", { className: c.icon, style: { fontSize: 44, color: 'black' }, ref: e => {
                                            if (!e)
                                                return;
                                            let ctrl = c.componentData;
                                            this.componentDraggable(e, ctrl);
                                        } })),
                                React.createElement("div", null, c.displayName));
                        }))));
            });
        }
    }
    jueying.ComponentPanel = ComponentPanel;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class ComponentWrapper extends React.Component {
        designtimeBehavior(element, attr) {
            if (!element)
                throw jueying.Errors.argumentNull('element');
            if (!attr)
                throw jueying.Errors.argumentNull('args');
            let designer = this.props.designer;
            console.assert(attr.container != null);
            console.assert(attr.movable != null);
            if (attr.container) {
                ComponentWrapper.enableDroppable(element, designer);
            }
            if (attr.movable) {
                console.assert(element != null);
                ComponentWrapper.draggable(designer, element);
                if (this.handler != null)
                    ComponentWrapper.draggable(designer, element, this.handler);
            }
            else {
                element.onclick = (ev) => ComponentWrapper.invokeOnClick(ev, designer, element);
            }
        }
        /**
         * 启用拖放操作，以便通过拖放图标添加控件
         */
        static enableDroppable(element, designer) {
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
                let ctrl = jueying.ComponentPanel.getComponentData(event.dataTransfer);
                if (!ctrl)
                    return;
                ctrl.props.style = ctrl.props.style || {};
                designer.pageData.props.style = designer.pageData.props.style || {};
                if (!ctrl.props.style.position) {
                    ctrl.props.style.position = designer.pageData.props.style.position;
                }
                let pos = jueying.ComponentPanel.mouseInnerPosition(event.dataTransfer);
                console.assert(pos != null);
                if (ctrl.props.style.position == 'absolute') {
                    ctrl.props.style.left = event.layerX - pos.x;
                    ctrl.props.style.top = event.layerY - pos.y;
                }
                designer.appendComponent(element.id, ctrl);
            };
        }
        static isResizeHandleClassName(className) {
            let classNames = [
                'resize_handle NE', 'resize_handle NN', 'resize_handle NW',
                'resize_handle WW', 'resize_handle EE', 'resize_handle SW',
                'resize_handle SS', 'resize_handle SE',
            ];
            return classNames.indexOf(className) >= 0;
        }
        static draggable(designer, element, handler) {
            if (!designer)
                throw jueying.Errors.argumentNull('designer');
            if (!element)
                throw jueying.Errors.argumentNull('element');
            handler = handler || element;
            let componentId = element.id;
            console.assert(componentId);
            let startPos;
            let rect;
            let dragStart;
            $(handler)
                .drag("init", function (ev) {
                startPos = $(element).position();
                if ($(this).is(`.${jueying.classNames.componentSelected}`))
                    return $(`.${jueying.classNames.componentSelected}`);
            })
                .drag('start', function (ev, dd) {
                dd.attr = $(ev.target).prop("className");
                dd.width = $(this).width();
                dd.height = $(this).height();
                dragStart = Date.now();
            })
                .drag(function (ev, dd) {
                ev.preventDefault();
                ev.stopPropagation();
                rect = {};
                if (dd.attr.indexOf("E") > -1) {
                    rect.width = Math.max(32, dd.width + dd.deltaX);
                }
                if (dd.attr.indexOf("S") > -1) {
                    rect.height = Math.max(32, dd.height + dd.deltaY);
                }
                if (dd.attr.indexOf("W") > -1) {
                    rect.width = Math.max(32, dd.width - dd.deltaX);
                    setLeft(dd);
                }
                if (dd.attr.indexOf("N") > -1) {
                    rect.height = Math.max(32, dd.height - dd.deltaY);
                    setTop(dd);
                }
                if (dd.attr.indexOf("WW") >= 0)
                    setLeft(dd);
                if (dd.attr.indexOf("NE") >= 0 || dd.attr.indexOf("NW") >= 0 || dd.attr.indexOf("SW") >= 0)
                    setPosition(dd);
                if (dd.attr.indexOf("NN") >= 0)
                    setTop(dd);
                if (dd.attr.indexOf("drag") > -1) {
                    rect.top = dd.offsetY;
                    rect.left = dd.offsetX;
                }
                if (!ComponentWrapper.isResizeHandleClassName(dd.attr)) {
                    setPosition(dd);
                }
                if (dd.attr)
                    $(this).css(rect);
            }, { click: true })
                .drag('end', function (ev, dd) {
                let interval = Date.now() - dragStart;
                ComponentWrapper.isDrag = interval >= 300;
                if (!ComponentWrapper.isResizeHandleClassName(dd.attr)) {
                    let left = startPos.left + dd.deltaX;
                    let top = startPos.top + dd.deltaY;
                    designer.setComponentPosition(element.id, { left, top });
                    element.style.transform = '';
                }
                else {
                    let left, top;
                    if (dd.attr.indexOf("W") > -1)
                        left = startPos.left + dd.deltaX;
                    if (dd.attr.indexOf("N") > -1)
                        top = startPos.top + dd.deltaY;
                    element.style.transform = '';
                    designer.setComponentPosition(element.id, { left, top });
                    designer.setComponentSize(componentId, rect);
                }
            })
                .click((ev) => {
                ComponentWrapper.invokeOnClick(ev, designer, element);
            });
            let setPosition = (dd) => {
                console.log(['dd.offsetX, dd.offsetY', dd.offsetX, dd.offsetY]);
                console.log(dd);
                element.style.transform = `translate(${dd.deltaX}px,${dd.deltaY}px)`;
            };
            let setTop = (dd) => {
                element.style.transform = `translateY(${dd.deltaY}px)`;
            };
            let setLeft = (dd) => {
                element.style.transform = `translateX(${dd.deltaX}px)`;
            };
        }
        static invokeOnClick(ev, designer, element) {
            ev.preventDefault();
            ev.stopPropagation();
            if (ComponentWrapper.isDrag) {
                ComponentWrapper.isDrag = false;
                return;
            }
            let elementID = element.id;
            if (!ev.ctrlKey) {
                designer.selectComponent(element.id);
                return;
            }
            let selectedControlIds = designer.selectedComponentIds;
            console.assert(elementID);
            if (selectedControlIds.indexOf(elementID) >= 0) {
                selectedControlIds = selectedControlIds.filter(o => o != elementID);
            }
            else {
                selectedControlIds.push(elementID);
            }
            designer.selectComponent(selectedControlIds);
        }
        componentDidMount() {
            if (this.element.getAttribute('data-behavior')) {
                return;
            }
            this.element.setAttribute('data-behavior', 'behavior');
            let type = this.props.type;
            let typename = typeof type == 'string' ? type : type.name;
            let attr = jueying.Component.getAttribute(typename);
            this.designtimeBehavior(this.element, attr);
        }
        render() {
            let style = this.props.style || {};
            let { top, left, position, width, height, display, visibility } = style;
            let props = this.props;
            let className = jueying.appendClassName(props.className || '', jueying.classNames.component);
            if (props.selected) {
                className = jueying.appendClassName(className, jueying.classNames.componentSelected);
            }
            let wrapperProps = {
                id: props.id,
                className: className,
                style: { top, left, position, width, height, display, visibility },
                ref: (e) => this.element = e || this.element
            };
            let type = this.props.type;
            let typename = typeof type == 'string' ? type : type.name;
            let attr = jueying.Component.getAttribute(typename);
            let move_handle = this.props.selected && attr.showHandler ? React.createElement("div", { className: "move_handle", style: {}, ref: e => this.handler = e || this.handler }) : null;
            return React.createElement("div", Object.assign({}, wrapperProps),
                move_handle,
                attr.resize ?
                    React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "resize_handle NE" }),
                        React.createElement("div", { className: "resize_handle NN" }),
                        React.createElement("div", { className: "resize_handle NW" }),
                        React.createElement("div", { className: "resize_handle WW" }),
                        React.createElement("div", { className: "resize_handle EE" }),
                        React.createElement("div", { className: "resize_handle SW" }),
                        React.createElement("div", { className: "resize_handle SS" }),
                        React.createElement("div", { className: "resize_handle SE" })) : null,
                this.props.children);
        }
    }
    ComponentWrapper.isDrag = false;
    jueying.ComponentWrapper = ComponentWrapper;
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
 * component.tsx 文件用于运行时加载，所以要控制此文件的大小，用于在运行时创建页面
 *
 ********************************************************************************/
var jueying;
(function (jueying) {
    jueying.DesignerContext = React.createContext({ designer: null });
    function component(args) {
        return function (constructor) {
            if (jueying.PageDesigner) {
                Component.setAttribute(constructor.name, args);
            }
            Component.register(constructor.name, constructor);
            return constructor;
        };
    }
    jueying.component = component;
    class Component {
        /**
         * 设置组件特性
         * @param typename 组件类型名称
         * @param attr 组件特性
         */
        static setAttribute(typename, attr) {
            Component.componentAttributes[typename] = attr;
        }
        /**
         * 获取组件特性
         * @param typename 组件类型名称
         */
        // static getAttribute(typename: string)
        static getAttribute(type) {
            let typename = typeof type == 'string' ? type : type.name;
            let attr = Component.componentAttributes[typename];
            return Object.assign({}, Component.defaultComponentAttribute, attr || {});
        }
        static getPropEditors(controlClassName) {
            let classEditors = this.controlPropEditors[controlClassName] || [];
            return classEditors;
        }
        static getPropEditor(controlClassName, ...propNames) {
            return this.getPropEditorByArray(controlClassName, propNames);
        }
        /** 通过属性数组获取属性的编辑器 */
        static getPropEditorByArray(controlClassName, propNames) {
            let classEditors = this.controlPropEditors[controlClassName] || [];
            let editor = classEditors.filter(o => o.propNames.join('.') == propNames.join('.'))[0];
            return editor;
        }
        static setPropEditor(componentType, propName, editorType, group) {
            group = group || '';
            let propNames = propName.split('.');
            let className = typeof componentType == 'string' ? componentType : componentType.prototype.typename || componentType.name;
            let classProps = Component.controlPropEditors[className] = Component.controlPropEditors[className] || [];
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
        /**
         * 将持久化的元素数据转换为 ReactElement
         * @param args 元素数据
         */
        static createElement(args, h) {
            h = h || React.createElement;
            try {
                let type = args.type;
                let componentName = args.type;
                let controlType = Component.componentTypes[componentName];
                if (controlType) {
                    type = controlType;
                }
                let children = args.children ? args.children.map(o => Component.createElement(o, h)) : [];
                console.assert(args.props);
                let props = JSON.parse(JSON.stringify(args.props));
                let result;
                result = h(type, props, ...children);
                return result;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        }
        static register(componentName, componentType) {
            if (componentType == null && typeof componentName == 'function') {
                componentType = componentName;
                componentName = componentType.name;
                componentType['componentName'] = componentName;
            }
            if (!componentName)
                throw jueying.Errors.argumentNull('componentName');
            if (!componentType)
                throw jueying.Errors.argumentNull('componentType');
            Component.componentTypes[componentName] = componentType;
        }
    }
    Component.defaultComponentAttribute = {
        container: false, movable: false, showHandler: false, resize: false
    };
    Component.componentAttributes = {
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
    };
    Component.controlPropEditors = {};
    Component.componentTypes = {};
    jueying.Component = Component;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    class EditorPanel extends React.Component {
        constructor(props) {
            super(props);
            this.state = { componentDatas: [] };
        }
        componentWillReceiveProps(props) {
            this.setState({ designer: props.designer });
        }
        getComponentData(designer) {
            let componentDatas = [];
            let stack = new Array();
            stack.push(designer.pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                componentDatas.push(item);
                let children = item.children || [];
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i]);
                }
            }
            return componentDatas;
        }
        render() {
            let { emptyText } = this.props;
            emptyText = emptyText || '';
            let componentDatas = [];
            let selectedComponentIds = [];
            let designer = this.state.designer;
            if (designer) {
                componentDatas = this.getComponentData(designer);
                selectedComponentIds = designer.selectedComponentIds || [];
            }
            return React.createElement("div", { className: "editor-panel panel panel-primary", ref: (e) => this.element = e || this.element },
                React.createElement("div", { className: "panel-heading" }, "\u5C5E\u6027"),
                React.createElement("div", { className: "panel-body" },
                    React.createElement("div", { className: "form-group" },
                        React.createElement("select", { className: "form-control", ref: e => {
                                if (!e)
                                    return;
                                e.value = selectedComponentIds.length == 1 ? selectedComponentIds[0] : '';
                                e.onchange = () => {
                                    if (designer && e.value)
                                        designer.selectComponent(e.value);
                                };
                            } }, componentDatas.map(o => React.createElement("option", { key: o.props.id, id: o.props.id, value: o.props.id }, o.props.name)))),
                    React.createElement(jueying.ComponentEditor, { designer: designer, ref: e => this.editor = e || this.editor })));
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
    class PageDesigner extends React.Component {
        constructor(props) {
            super(props);
            this.componentSelected = jueying.Callback.create();
            this.componentRemoved = jueying.Callback.create();
            this.componentAppend = jueying.Callback.create();
            this.componentUpdated = jueying.Callback.create();
            this.designtimeComponentDidMount = jueying.Callback.create();
            this.namedComponents = {};
            this.initPageData(props.pageData);
            this.state = { pageData: props.pageData };
            this.designtimeComponentDidMount.add((args) => {
                console.log(`this:designer event:controlComponentDidMount`);
            });
        }
        initPageData(pageData) {
            if (pageData == null) {
                return;
            }
            this.nameComponent(pageData);
        }
        get pageData() {
            return this.state.pageData;
        }
        get selectedComponentIds() {
            return this.selectedComponents.map(o => o.props.id);
        }
        get selectedComponents() {
            let arr = new Array();
            let stack = new Array();
            stack.push(this.pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                if (item.props.selected == true)
                    arr.push(item);
                let children = item.children || [];
                for (let i = 0; i < children.length; i++)
                    stack.push(children[i]);
            }
            return arr;
        }
        updateControlProps(controlId, navPropsNames, value) {
            let componentData = this.findComponentData(controlId);
            if (componentData == null)
                return;
            console.assert(componentData != null);
            console.assert(navPropsNames != null, 'props is null');
            componentData.props = componentData.props || {};
            let obj = componentData.props;
            for (let i = 0; i < navPropsNames.length - 1; i++) {
                obj = obj[navPropsNames[i]] = obj[navPropsNames[i]] || {};
            }
            obj[navPropsNames[navPropsNames.length - 1]] = value;
            this.setState(this.state);
            this.componentUpdated.fire([componentData]);
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
        /**
         * 对组件及其子控件进行命名
         * @param component
         */
        nameComponent(component) {
            let props = component.props = component.props || {};
            if (!props.name) {
                let num = 0;
                let name;
                do {
                    num = num + 1;
                    name = `${component.type}${num}`;
                } while (this.namedComponents[name]);
                this.namedComponents[name] = component;
                props.name = name;
            }
            if (!props.id)
                props.id = jueying.guid();
            if (!component.children || component.children.length == 0) {
                return;
            }
            for (let i = 0; i < component.children.length; i++) {
                this.nameComponent(component.children[i]);
            }
        }
        /** 添加控件 */
        appendComponent(parentId, childControl, childIds) {
            if (!parentId)
                throw jueying.Errors.argumentNull('parentId');
            if (!childControl)
                throw jueying.Errors.argumentNull('childControl');
            this.nameComponent(childControl);
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
            this.componentAppend.fire(this);
        }
        /** 设置控件位置 */
        setComponentPosition(componentId, position) {
            return this.setComponentsPosition([{ componentId, position }]);
        }
        setComponentSize(componentId, size) {
            console.assert(componentId);
            console.assert(size);
            let componentData = this.findComponentData(componentId);
            if (!componentData)
                throw new Error(`Control ${componentId} is not exits.`);
            let style = componentData.props.style = (componentData.props.style || {});
            if (size.height)
                style.height = size.height;
            if (size.width)
                style.width = size.width;
            let { pageData } = this.state;
            this.setState({ pageData });
            this.componentUpdated.fire([componentData]);
        }
        setComponentsPosition(positions) {
            let componentDatas = new Array();
            positions.forEach(o => {
                let { componentId } = o;
                let { left, top } = o.position;
                let componentData = this.findComponentData(componentId);
                if (!componentData)
                    throw new Error(`Control ${componentId} is not exits.`);
                let style = componentData.props.style = (componentData.props.style || {});
                if (left)
                    style.left = left;
                if (top)
                    style.top = top;
                let { pageData } = this.state;
                this.setState({ pageData });
                componentDatas.push(componentData);
            });
            this.componentUpdated.fire(componentDatas);
        }
        /**
         * 选择指定的控件
         * @param control 指定的控件
         */
        selectComponent(componentIds) {
            if (typeof componentIds == 'string')
                componentIds = [componentIds];
            var stack = [];
            stack.push(this.pageData);
            while (stack.length > 0) {
                let item = stack.pop();
                let isSelectedControl = componentIds.indexOf(item.props.id) >= 0;
                this.setComponentSelected(item, isSelectedControl);
                let children = item.children || [];
                for (let i = 0; i < children.length; i++) {
                    stack.push(children[i]);
                }
            }
            // this._selectedComponentIds = componentIds
            componentIds.map(id => this.findComponentData(id)).forEach(o => {
                console.assert(o != null);
                // let props = o.props as ComponentProps<any>
                // props.selected = true
                // let arr = (props.className || '').split(' ').filter(O => o) //= (props.className || '') + ' ' + classNames.componentSelected
                // if (props.selected)
                this.setComponentSelected(o, true);
            });
            this.setState({ pageData: this.pageData });
            this.componentSelected.fire(this.selectedComponentIds);
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
            // this._selectedComponentIds = this._selectedComponentIds.filter(id => controlIds.indexOf(id) < 0)
            this.setState({ pageData });
            this.componentRemoved.fire(controlIds);
        }
        /** 移动控件到另外一个控件容器 */
        moveControl(componentId, parentId, childIds) {
            let control = this.findComponentData(componentId);
            if (control == null)
                throw new Error(`Cannt find control by id ${componentId}`);
            console.assert(control != null, `Cannt find control by id ${componentId}`);
            let pageData = this.state.pageData;
            console.assert(pageData.children);
            this.removeControlFrom(componentId, pageData.children);
            this.appendComponent(parentId, control, childIds);
        }
        setComponentSelected(component, value) {
            component.props.selected = value;
            component.props.className = component.props.className || '';
            let arr = component.props.className.split(' ') || [];
            arr = arr.filter(a => a != '' && a != jueying.classNames.componentSelected);
            if (value == true) {
                arr.push(jueying.classNames.componentSelected);
            }
            component.props.className = arr.join(' ').trim();
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
                if (this.selectedComponents.length == 0)
                    return;
                this.removeControl(...this.selectedComponentIds);
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
            let shouldWrapper = true;
            // let tagName: keyof HTMLElementTagNameMap = type as keyof HTMLElementTagNameMap
            // if (tagName == 'html' || tagName == 'head' || tagName == 'body' ||
            //     tagName == 'thead' || tagName == 'tbody' || tagName == 'tfoot' || tagName == 'th' || tagName == 'tr' || tagName == 'td' ||
            //     tagName == 'li') {
            //     allowWrapper = false
            // }
            let attr = jueying.Component.getAttribute(type);
            shouldWrapper = attr.resize || attr.movable || typeof type != 'string';
            if (shouldWrapper) {
                let style = Object.assign({}, props.style || {});
                delete props.style.left;
                delete props.style.top;
                delete props.style.position;
                props.style.width = '100%';
                props.style.height = '100%';
                return React.createElement(jueying.ComponentWrapper, Object.assign({}, props, { type: type, designer: this, style: style }), React.createElement(type, props, ...children));
            }
            props.ref = (e) => {
                if (!e)
                    return;
                if (e.tagName) {
                    e.onclick = (ev) => {
                        jueying.ComponentWrapper.invokeOnClick(ev, this, e);
                    };
                    let typename = typeof type == 'string' ? type : type.name;
                    let attr = jueying.Component.getAttribute(typename);
                    if (attr != null && attr.container) {
                        jueying.ComponentWrapper.enableDroppable(e, this);
                    }
                    return;
                }
                throw new Error('not implement');
            };
            let element = React.createElement(type, props, ...children);
            return element;
        }
        componentWillReceiveProps(props) {
            this.initPageData(props.pageData);
            this.setState({ pageData: props.pageData });
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
                    let pageView = pageData ? jueying.Component.createElement(pageData, this.createDesignTimeElement.bind(this)) : null;
                    return pageView;
                })()));
            return result;
        }
    }
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
                if (Array.isArray(items)) {
                    let tmp = items;
                    items = {};
                    for (let i = 0; i < tmp.length; i++) {
                        items[tmp[i]] = tmp[i];
                    }
                }
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
    jueying.classNames = {
        componentSelected: `component-selected`,
        emptyTemplates: `empty-templates`,
        loadingTemplates: `loading-templates`,
        templateSelected: `template-selected`,
        templateDialog: `template-dialog`,
        emptyDocument: `empty-document`,
        component: 'component',
        componentWrapper: 'component-wrapper'
    };
    let templateDialog = {
        nameHeight: 40,
        fontSize: 22
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
        .${jueying.classNames.templateDialog} .name {
            margin-top: -${templateDialog.nameHeight}px;
            height: ${templateDialog.nameHeight}px;
            font-size: ${templateDialog.fontSize}px;
            text-align: center;
            padding-top: 6px;
            background-color: black;
            opacity: 0.5;
        }
        .${jueying.classNames.templateDialog} .name span {
            color: white;
        }
        .${jueying.classNames.emptyDocument} {
            text-align: center;
            padding: 100px 0;
        }
        ul.nav-tabs li i {
            position: relative;
            top: 4px;
            right: -6px;
        }
        .validationMessage {
            position: absolute;
            margin-top: -60px;
            background-color: red;
            color: white;
            padding: 4px 10px;
        }
    `;
    document.head.appendChild(element);
    function appendClassName(sourceClassName, addonClassName) {
        console.assert(sourceClassName != null);
        console.assert(addonClassName);
        if (sourceClassName.indexOf(addonClassName) >= 0)
            return sourceClassName;
        return `${sourceClassName} ${addonClassName}`;
    }
    jueying.appendClassName = appendClassName;
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var forms;
    (function (forms) {
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        forms.guid = guid;
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
        forms.isEquals = isEquals;
        function skipField(obj, field) {
            return typeof obj[field] == 'function';
        }
    })(forms = jueying.forms || (jueying.forms = {}));
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
    var forms;
    (function (forms) {
        class DesignerFramework extends React.Component {
            constructor(props) {
                super(props);
                this.state = {};
                this.changedManages = {};
            }
            renderButtons(activeDocument, buttonClassName) {
                buttonClassName = buttonClassName || 'btn btn-default';
                let isChanged = activeDocument ? activeDocument.notSaved : false;
                let addon = this.state.addon;
                let buttons = [
                    React.createElement("button", { className: buttonClassName, disabled: !isChanged, onClick: () => this.save() },
                        React.createElement("i", { className: "icon-save" }),
                        React.createElement("span", null, "\u4FDD\u5B58")),
                    React.createElement("button", { className: buttonClassName, disabled: this.changedManage == null || !this.changedManage.canRedo, onClick: () => this.redo() },
                        React.createElement("i", { className: "icon-repeat" }),
                        React.createElement("span", null, "\u91CD\u505A")),
                    React.createElement("button", { className: buttonClassName, disabled: this.changedManage == null || !this.changedManage.canUndo, onClick: () => this.undo() },
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
                        React.createElement("span", null, "\u6253\u5F00")),
                ];
                if (addon != null && addon.renderToolbarButtons) {
                    buttons.push(...addon.renderToolbarButtons({ activeDocument }) || []);
                }
                return buttons;
            }
            get storage() {
                if (this._storage == null)
                    this._storage = new forms.LocalDocumentStorage();
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
            get changedManage() {
                let activeDocument = this.state.activeDocument;
                if (activeDocument == null)
                    return null;
                return this.changedManages[activeDocument.fileName];
            }
            //======================================================
            // Virtual Method
            undo() {
                let pageData = this.changedManage.undo();
                let { activeDocument } = this.state;
                activeDocument.document.pageData = pageData;
                this.setState({ activeDocument });
            }
            redo() {
                let pageData = this.changedManage.redo();
                let { activeDocument } = this.state;
                activeDocument.document.pageData = pageData;
                this.setState({ activeDocument });
            }
            save() {
                return __awaiter(this, void 0, void 0, function* () {
                    let { activeDocument, pageDocuments } = this.state;
                    let pageDocument = activeDocument;
                    console.assert(pageDocument != null);
                    pageDocument.save();
                    this.setState({ pageDocuments });
                });
            }
            loadDocument(template, isNew) {
                return __awaiter(this, void 0, void 0, function* () {
                    let fileName = template.name;
                    console.assert(fileName);
                    console.assert(template);
                    let { pageData } = template;
                    let { pageDocuments } = this.state;
                    let documentStorage = this.storage;
                    let pageDocument = isNew ? forms.PageDocumentFile.new(documentStorage, fileName, template) :
                        yield forms.PageDocumentFile.load(documentStorage, fileName);
                    this.changedManages[fileName] = new jueying.JSONUndoRedo(pageData);
                    pageDocuments = pageDocuments || [];
                    pageDocuments.push(pageDocument);
                    let addon;
                    if (template.addonPath) {
                        try {
                            let es = yield chitu.loadjs(`${template.addonPath}/index`);
                            console.log(`load addon ${template.addonPath}/index success`);
                            console.assert(es.default != null);
                            addon = es.default;
                            // components = addon.components || []
                            // this.setState({ addon })
                        }
                        catch (e) {
                            console.log(`load addon ${template.addonPath}/addon fail`);
                        }
                    }
                    this.setState({
                        pageDocuments, addon,
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
                    forms.TemplateDialog.show({
                        fetch: () => this.fetchTemplates(),
                        requiredFileName: true,
                        callback: (tmp) => {
                            this.loadDocument(tmp, true);
                        }
                    });
                });
            }
            open() {
                forms.TemplateDialog.show({
                    fetch: (pageIndex, pageSize) => __awaiter(this, void 0, void 0, function* () {
                        let result = yield this.storage.list(pageIndex, pageSize);
                        let items = result.items; //.map(a => ({ name: a[0], pageData: a[1] }));
                        let count = result.count;
                        return { items: items, count };
                    }),
                    callback: (tmp) => {
                        let docs = this.state.pageDocuments || [];
                        let existDoc = docs.filter(o => o.fileName == tmp.name)[0];
                        if (existDoc) {
                            let index = docs.indexOf(existDoc);
                            this.activeDocument(index);
                            return;
                        }
                        this.loadDocument(tmp, false);
                    }
                });
            }
            activeDocument(index) {
                let { pageDocuments } = this.state;
                let doc = pageDocuments[index];
                console.assert(doc != null);
                this.setState({ activeDocument: doc });
                setTimeout(() => {
                    let pageViewId = doc.document.pageData.props.id;
                    console.assert(pageViewId != null, 'pageView id is null');
                    console.assert(doc.document.pageData.type == 'PageView');
                    this.pageDesigner.selectComponent(pageViewId);
                }, 50);
            }
            setState(state) {
                super.setState(state);
            }
            closeDocument(index) {
                let { pageDocuments } = this.state;
                console.assert(pageDocuments != null);
                let doc = pageDocuments[index];
                console.assert(doc != null);
                let close = () => {
                    pageDocuments.splice(index, 1);
                    let activeDocumentIndex = index > 0 ? index - 1 : 0;
                    let activeDocument = pageDocuments[activeDocumentIndex];
                    this.setState({ pageDocuments, activeDocument, addon: null });
                };
                if (!doc.notSaved) {
                    close();
                    return;
                }
                ui.confirm({
                    title: '提示',
                    message: '该页面尚未保存，是否保存?',
                    confirmText: '保存',
                    cancelText: '不保存',
                    confirm: () => __awaiter(this, void 0, void 0, function* () {
                        yield doc.save();
                        close();
                    }),
                    cancle: () => {
                        close();
                        return Promise.resolve();
                    },
                });
            }
            designerRef(e) {
                if (!e)
                    return;
                this.pageDesigner = e || this.pageDesigner;
                let func = () => {
                    let activeDocument = this.state.activeDocument;
                    this.changedManage.setChangedData(activeDocument.document.pageData);
                    this.renderToolbar(this.toolbarElement);
                    this.renderEditorPanel(this.editorPanelElement);
                };
                this.pageDesigner.componentRemoved.add(func);
                this.pageDesigner.componentAppend.add(func);
                this.pageDesigner.componentUpdated.add(func);
                this.pageDesigner.componentSelected.add(func);
            }
            renderToolbar(element) {
                let pageDocument = this.state.activeDocument;
                let buttons = this.renderButtons(pageDocument);
                let { title } = this.props;
                ReactDOM.render(React.createElement(React.Fragment, null,
                    React.createElement("li", { className: "pull-left" },
                        React.createElement("h3", null, title || '')),
                    buttons.map((o, i) => React.createElement("li", { key: i, className: "pull-right" }, o))), element);
            }
            renderEditorPanel(element) {
                ReactDOM.render(React.createElement(jueying.EditorPanel, { emptyText: "未选中控件，点击页面控件，可以编辑选中控件的属性", designer: this.pageDesigner, ref: e => this.editorPanel = e || this.editorPanel }), element);
            }
            render() {
                let { activeDocument, pageDocuments, addon } = this.state;
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
                                o.fileName,
                                React.createElement("i", { className: "pull-right icon-remove", style: { cursor: 'pointer' }, onClick: (e) => {
                                        e.cancelable = true;
                                        e.stopPropagation();
                                        this.closeDocument(i);
                                    } }))))),
                        pageDocument ?
                            React.createElement(jueying.PageDesigner, { pageData: pageDocument.document.pageData, ref: e => this.designerRef(e) }) : null),
                    React.createElement(jueying.ComponentPanel, { className: "component-panel", componets: addon ? addon.components : [] }),
                    React.createElement("div", { ref: e => {
                            if (!e)
                                return;
                            this.editorPanelElement = e || this.editorPanelElement;
                            this.renderEditorPanel(e);
                        } }));
            }
        }
        forms.DesignerFramework = DesignerFramework;
    })(forms = jueying.forms || (jueying.forms = {}));
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var forms;
    (function (forms) {
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
                        allItems.push(doc);
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
        forms.LocalDocumentStorage = LocalDocumentStorage;
    })(forms = jueying.forms || (jueying.forms = {}));
})(jueying || (jueying = {}));
var jueying;
(function (jueying) {
    var forms;
    (function (forms) {
        class PageDocumentFile {
            constructor(fileName, storage, document) {
                this.storage = storage;
                this._document = document;
                this.originalPageData = JSON.parse(JSON.stringify(document));
                this._fileName = fileName;
            }
            save() {
                this.originalPageData = JSON.parse(JSON.stringify(this._document));
                return this.storage.save(this._fileName, this._document);
            }
            get notSaved() {
                let equals = forms.isEquals(this.originalPageData, this._document);
                return !equals;
            }
            get fileName() {
                return this._fileName;
            }
            get document() {
                return this._document;
            }
            set document(value) {
                this._document = value;
            }
            static load(storage, fileName) {
                return __awaiter(this, void 0, void 0, function* () {
                    // let storage = new LocalDocumentStorage()
                    let data = yield storage.load(fileName);
                    if (data == null) {
                        throw jueying.Errors.fileNotExists(fileName);
                    }
                    return new PageDocumentFile(fileName, storage, data);
                });
            }
            static new(storage, fileName, init) {
                // let storage = new LocalDocumentStorage()
                return new PageDocumentFile(fileName, storage, init);
            }
        }
        forms.PageDocumentFile = PageDocumentFile;
    })(forms = jueying.forms || (jueying.forms = {}));
})(jueying || (jueying = {}));
/// <reference path="comon.tsx"/>
var jueying;
(function (jueying) {
    var forms;
    (function (forms) {
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
                        let template = JSON.parse(JSON.stringify(templates[selectedTemplateIndex]));
                        if (fileName)
                            template.name = fileName;
                        this.callback(template);
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
                                React.createElement("div", { className: jueying.classNames.loadingTemplates }, "\u6570\u636E\u6B63\u5728\u52A0\u8F7D\u4E2D") :
                                templates.length == 0 ?
                                    React.createElement("div", { className: jueying.classNames.emptyTemplates }, "\u6682\u65E0\u6A21\u7248\u6570\u636E") :
                                    React.createElement(React.Fragment, null,
                                        templates.map((o, i) => React.createElement("div", { key: i, style: { width, height, float: i == 2 ? 'right' : 'left', margin: i == 1 ? '0 0 0 15px' : null }, onClick: () => this.selectTemplate(i), className: i == selectedTemplateIndex ? jueying.classNames.templateSelected : null },
                                            React.createElement(PageViewContainer, null,
                                                jueying.Component.createElement(o.pageData),
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
        forms.TemplateDialog = TemplateDialog;
        let dialog_element = document.createElement('div');
        dialog_element.className = `modal fade ${jueying.classNames.templateDialog}`;
        document.body.appendChild(dialog_element);
        let defaultInstance;
        ReactDOM.render(React.createElement(TemplateDialog, { ref: (e) => defaultInstance = e || defaultInstance }), dialog_element);
    })(forms = jueying.forms || (jueying.forms = {}));
})(jueying || (jueying = {}));
//# sourceMappingURL=jueying.js.map