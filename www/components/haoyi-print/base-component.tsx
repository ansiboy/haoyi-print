import { ComponentProps } from "jueying";
import * as React from 'react';
import { ControlSize } from "components/controls/controlSize";
import { PageViewContext, PageView } from "./page-view";
import { setStyleEditor } from "./component-editors";
export { setStyleEditor }

export interface BaseControlProps<T> extends ComponentProps<T> {
    text?: string,
    field?: string,
}

export function compoentStyleEditors<T extends { new(...args: any[]): {} }>(constructor: T) {
    setStyleEditor(constructor as any)
    return constructor
}

export abstract class BaseControl<P extends BaseControlProps<any>, S> extends React.Component<P, S> {
    private _render: (h?: any) => React.ReactNode
    pageView: PageView
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

