import { Control, EditorProps, ControlEditor as Editor, ControlProps, PageViewContext, PageView, ControlPropEditors, textInput } from "jueying";
import * as React from 'react';
import { ControlSize } from "components/controls/controlSize";

export interface BaseControlProps<T> extends ControlProps<T> {
    text?: string,
    field?: string,
}

export abstract class BaseControl<P extends BaseControlProps<any>, S> extends Control<P, S> {
    private _render: (h?: any) => React.ReactNode
    protected pageView: PageView

    constructor(props: P) {
        super(props);

        console.assert(this.render != null)
        this._render = this.render
        this.render = (h?: any) => {
            return <PageViewContext.Consumer>
                {c => {
                    this.pageView = c.pageView
                    return this._render(h)
                }}
            </PageViewContext.Consumer>
        }
    }

    protected text(): string {
        console.assert(this.pageView != null)
        if (this.props.text)
            return this.props.text

        if (this.props.field) {
            let text: string = null
            if (this.pageView.props.data) {
                text = this.pageView.props.data[this.props.field]
            }

            if (!text)
                text = `[${this.props.field}]`

            return text;
        }

        return this.props.name
    }

    protected createElement(type: string | React.ComponentClass<any>,
        props: React.HTMLAttributes<any> & React.Attributes, ...children: any[]) {

        if (props != null && props.style != null) {
            if (props.style.left && typeof props.style.left == 'number') {
                // let num = toUnit(props.style.left, this.pageView.props.unit)
                // props.style.left = `${props.style.left / num}${this.pageView.props.unit}`
            }
        }

        return super.createElement(type, props, ...children)
    }
}


export abstract class BaseControlEditor<T extends BaseControlProps<any>> extends Editor<EditorProps, Partial<T>> {
    constructor(props) {
        super(props)
    }
    abstract renderControlProps(): JSX.Element;
    render() {
        let { name, style, field, text } = this.state;
        style = style || {};
        let { left, top } = style;
        return this.Element(<>
            <div className="form-group">
                <label>名称</label>
                <div className="control">
                    <input className="form-control" value={name || ''}
                        onChange={(e) => {
                            name = (e.target as HTMLInputElement).value;
                            this.setState({ name });
                        }} />
                </div>
            </div>
            <div className="form-group">
                <label>文本</label>
                <div className="control">
                    <input className="form-control" value={text || ''}
                        onChange={(e) => {
                            text = e.target.value
                            this.setState({ text });
                        }} />
                </div>
            </div>
            <div className="form-group">
                <label>字段</label>
                <div className="control">
                    <input className="form-control" value={field || ''}
                        onChange={(e) => {
                            field = e.target.value
                            this.setState({ field });
                        }} />
                </div>
            </div>
            <div className="form-group">
                <label>左边</label>
                <div className="control">
                    <ControlSize size={left} onChange={size => {
                        style = JSON.parse(JSON.stringify(style))
                        style.left = size
                        this.setState({ style })
                    }} />
                </div>
            </div>
            <div className="form-group">
                <label>顶部</label>
                <div className="control">
                    <ControlSize size={top} onChange={size => {
                        style = JSON.parse(JSON.stringify(style))
                        style.top = size
                        this.setState({ style })
                    }} />
                </div>
            </div>
            {this.renderControlProps()}
        </>)
    }
}

export let cssProp = function (name: keyof React.CSSProperties) {
    let func = (style: React.CSSProperties, onChange: (value: React.CSSProperties) => void) => {
        let ctrl = <ControlSize size={style[name]} onChange={e => {
            style[name] = e
            onChange(style)
        }} />

        return ctrl
    }

    return func
}

export function createBasePropEditors(controlClass: React.ComponentClass) {
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "name">(controlClass, 'name', '名称', textInput)
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "text">(controlClass, 'text', '文本', textInput)
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "field">(controlClass, 'field', '字段', textInput)


    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "style">(controlClass, 'style', '左边', cssProp('left'))
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "style">(controlClass, 'style', '顶部', cssProp('top'))
}


