import React = require("react");
import ReactDOM = require("react-dom");

export interface PageViewProps {
    source?: chitu.Page,
}
export class PageView<P extends PageViewProps, S> extends React.Component<P, S>{
    private _render: () => React.ReactNode;
    active = chitu.Callbacks<this, any>()

    constructor(props: any) {
        super(props)
        if (this.render) {
            this._render = this.render
        }

        this.render = () => {
            if (this._render) {
                return <>
                    <PageViewContext.Provider value={{ pageView: this }}>
                        {this._render()}
                    </PageViewContext.Provider>
                </>
            }

            return null
        }
    }
    createService<T extends chitu.Service>(type?: chitu.ServiceConstructor<T>): T {
        return this.props.source.createService(type);
    }
    get element() {
        return this.props.source.element;
    }

    get name() {
        return this.props.source.name;
    }
    reload() {
        this.props.source.reload()
    }
}

export let PageViewContext = React.createContext<{ pageView: PageView<PageViewProps, any> }>(null)


export class Application extends chitu.Application {
    constructor() {
        super({ parser: Application.createParser() })
        this.error.add((sender, error) => {
            ui.alert(error.message);
        })
    }

    private static createParser(): chitu.PageNodeParser {
        let nodes: { [key: string]: chitu.PageNode } = {}
        return {
            actions: {},
            pageNameParse: (pageName) => {
                let node = nodes[pageName];
                if (node == null) {
                    let path = `modules_${pageName}`.split('_').join('/');
                    node = { action: this.createPageAction(path), name: pageName };
                    nodes[pageName] = node;
                }
                return node;
            }
        }
    }

    private static createPageAction(path: string) {
        console.assert(typeof path == 'string');
        let action = function (page: chitu.Page) {
            console.assert(typeof path == 'string');

            return chitu.loadjs(path).then(function (exports) {
                console.assert(exports != null);
                console.assert(exports.default != null);

                if (Application.isClass(exports.default) == false) {
                    exports.default(page);
                    return;
                }

                page.shown.add((sender, args) => {
                    var obj = Application.parseArguments(args as any)
                    let pageView = Application.renderElement(page, obj, exports.default) as PageView<any, any>
                    pageView.active.fire(this, args)
                })
                page.load.add((sender, args) => {
                    var obj = Application.parseArguments(args as any)
                    let pageView: PageView<any, any> = Application.renderElement(page, obj, exports.default) as PageView<any, any>
                    pageView.active.fire(this, args)
                })

            })
        }
        return action;
    }

    private static parseArguments(args: { [key: string]: string }) {
        let obj: { [key: string]: any } = {}
        for (let key in args) {
            obj[key] = this.isJSON(args[key]) ? JSON.parse(args[key]) : args[key]
        }
        return obj
    }

    private static isJSON(text: string) {
        if (!text) return false
        if (text.startsWith(`{`) && text.endsWith(`}`))
            return true

        return false
    }

    private static renderElement(page: chitu.Page, args: any, elementType: any) {
        let props = Object.assign({}, { source: page }, args);
        let element = React.createElement(elementType, props);
        return ReactDOM.render(element, page.element);
    }

    protected createPageElement(pageName: string) {
        let element = super.createPageElement(pageName)
        element.className = `page ${pageName}`
        return element
    }

    static isClass = (function () {
        var toString = Function.prototype.toString;

        function fnBody(fn: Function) {
            return toString.call(fn).replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
        }

        function isClass(fn: Function) {
            return (typeof fn === 'function' &&
                (/^class(\s|\{\}$)/.test(toString.call(fn)) ||
                    (/^.*classCallCheck\(/.test(fnBody(fn)))) // babel.js
            );
        }

        return isClass
    })()
}




