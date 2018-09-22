import { Control, ControlProps, PageViewContext, PageView, ControlPropEditors, PropEditor, PropEditorProps, TextInput } from "jueying";
import * as React from 'react';
import { ControlSize } from "components/controls/controlSize";

export interface BaseControlProps<T> extends ControlProps<T> {
    text?: string,
    field?: string,
}

export abstract class BaseControl<P extends BaseControlProps<any>, S> extends Control<P, S> {
    private _render: (h?: any) => React.ReactNode
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
}

export let controlSize = function () {
    return ControlSize
}

export function createBasePropEditors(controlClass: React.ComponentClass) {
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "name">(controlClass, '名称', TextInput, 'name')
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "text">(controlClass, '文本', TextInput, 'text')
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "field">(controlClass, '字段', TextInput, 'field')


    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "style", "left">(controlClass, '左边', ControlSize, 'style', 'left')
    ControlPropEditors.setControlPropEditor<BaseControlProps<any>, "style", "top">(controlClass, '顶部', ControlSize, 'style', 'top')
}


