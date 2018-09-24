namespace jueying {

    /**
     * 说明：
     * core 文件用于运行时加载，所以要控制此文件的大小，用于在运行时创建页面
     * 
     */

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
            let c = constructor as any as React.ComponentClass<ControlProps<any>, any>
            let result = class ComponetWraper extends c implements DesigntimeComponent {
                wrapperElement: HTMLElement
                designer: PageDesigner
                id: string
                constructor(props, context) {
                    super(props, context)

                    this.id = this.props.id || guid()
                    // Control.addInstance(this.id, this)
                }

                get typename(): string {
                    return constructor.name
                }

                componentDidMount() {
                    if (super.componentDidMount)
                        super.componentDidMount()

                    if (this.designer != null) {
                        this.designtimeComponentDidMount()
                    }
                }

                designtimeComponentDidMount() {
                    if (args.container) {
                        this.designer.enableDroppable(this.wrapperElement)
                    }
                    if (args.movable) {
                        // this.designer.selectedControlIds
                        //     .map(id => document.getElementById(id))
                        //     .filter(o => o)
                        //     .forEach(element => {
                        // if ($(element).parents(`#${this.wrapperElement.id}`).length) {
                        //     console.assert(element.id, 'control id is null or empty.');
                        let element = document.getElementById(this.id)
                        console.assert(element != null)
                        this.designer.draggableControl(this.id)
                    }
                }

                render() {
                    return <DesignerContext.Consumer>
                        {c => {
                            this.designer = c.designer
                            if (this.designer) {
                                let component = this.renderDesigntime()
                                this.designer.designtimeComponentDidMount.fire({ component, element: this.wrapperElement })
                                return component
                            }

                            return super.render()
                        }}
                    </DesignerContext.Consumer>
                }

                renderDesigntime() {
                    console.assert(this.id != null)
                    let style = (this.props.style || {}) as React.CSSProperties
                    let { left, top, position } = style

                    return <div id={this.id} ref={e => this.wrapperElement = e || this.wrapperElement} className={this.props.selected ? classNames.controlSelected : ''}
                        style={{ left, top, position }}
                    // onClick={e => this.mouseDownOrClick(e)}
                    // onMouseDown={e => this.mouseDownOrClick(e)}
                    >
                        {(() => {

                            let createElement = React.createElement
                            React.createElement = createDesignTimeElement as any

                            let s = super.render()
                            React.createElement = createElement

                            return s
                        })()}
                    </div>
                }


            }

            core.register(constructor.name, result)

            return result
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
            if (t == null)
                throw new Error(`Component ${name} is not exists`)

            return t
        }
    }

    function createDesignTimeElement(type: string | React.ComponentClass<any>, props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]) {

        //====================================================
        // 将 props copy 出来，以便于可以修改
        props = Object.assign({}, props || {});
        //====================================================

        if (props.id != null)
            props.key = props.id;

        if (type == 'a' && (props as any).href) {
            (props as any).href = 'javascript:';
        }
        else if (type == 'input' || type == 'button') {
            delete props.onClick;
            (props as any).readOnly = true;
        }

        if (props.style) {
            let style = Object.assign({}, props.style)
            delete style.left
            delete style.top
            props.style = style
        }

        return core.originalCreateElement(type, props, ...children)
    }

    /**
     * 将持久化的元素数据转换为 ReactElement
     * @param args 元素数据
     */
    function toReactElement(args: ElementData, async?: boolean): React.ReactElement<any> | null {
        try {
            let type: string | React.ComponentClass = args.type;
            let componentName = args.type;
            let controlType = core.customControlTypes[componentName];
            if (controlType) {
                type = controlType;
            }

            let children = args.children ? args.children.map(o => this.toReactElement(o)) : [];


            let props = JSON.parse(JSON.stringify(args.props));
            let result = core.originalCreateElement<React.Props<any>>(type, props, ...children);
            if (async) {
                let elementChildren: React.ReactElement<any>[] = null
                if (result.props.children) {
                    elementChildren = (Array.isArray(result.props.children) ? result.props.children : [result.props.children]) as React.ReactElement<any>[]
                }
                let children: ElementData[] = []
                if (elementChildren)
                    children = elementChildren.map(o => toElementData(o))

                children.forEach(o => {
                    let notExists = args.children.filter(c => c.props.id == c.props.id).length == 0
                    if (notExists) {
                        args.children.push(o)
                    }
                })
            }
            return result
            //     }
            // );
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }

    function toElementData(element: React.ReactElement<React.Props<any>>): ElementData {

        let elementChildren: React.ReactElement<any>[] = null
        if (element.props.children) {
            let arr = Array.isArray(element.props.children) ? element.props.children : [element.props.children]
            elementChildren = arr as React.ReactElement<any>[]
        }

        let children: ElementData[] = null
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

        let data: ElementData = children ? { type, children, props } : { type, props }
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
}


