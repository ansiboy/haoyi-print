import { ComponentProps, Component, TextInput, PropEditorConstructor, dropdown } from "jueying";
import * as React from 'react';
import { ControlSize } from "components/controls/controlSize";
import { PageViewContext, PageView } from "./page-view";

export interface BaseControlProps<T> extends ComponentProps<T> {
    text?: string,
    field?: string,
}

export function stylePropEditors<T extends { new(...args: any[]): {} }>(constructor: T) {
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

export function setStyleEditor(componentType: React.ComponentClass | string) {
    type T = BaseControlProps<any>
    let func = Component.setPropEditor;
    func(componentType, 'style.width', TextInput, 'layout')
    func(componentType, 'style.height', TextInput, 'layout')
    setStylePropEditor(componentType, 'layout', 'width', TextInput)
    setStylePropEditor(componentType, 'layout', 'height', TextInput)
    setStylePropEditor(componentType, 'layout', 'padding', TextInput)
    setStylePropEditor(componentType, 'layout', 'margin', TextInput)
    setStylePropEditor(componentType, 'layout', 'left', TextInput)
    setStylePropEditor(componentType, 'layout', 'top', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxHeight', TextInput)
    setStylePropEditor(componentType, 'layout', 'minWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'minHeight', TextInput)

    setStylePropEditor(componentType, 'behavior', 'display', dropdown(['', 'none']))
    setStylePropEditor(componentType, 'behavior', 'visibility', dropdown(['', 'hidden', 'visible']))

    setStylePropEditor(componentType, 'appearance', 'background', TextInput)
    setStylePropEditor(componentType, 'appearance', 'border', TextInput)
    setStylePropEditor(componentType, 'appearance', 'font', TextInput)
    setStylePropEditor(componentType, 'appearance', 'color', TextInput)
    setStylePropEditor(componentType, 'appearance', 'cursor', TextInput)

    let fontSizes = {
        '8pt': '8pt', '9pt': '9pt', '10pt': '10pt',
        '11pt': '11pt', '12pt': '12pt', '13pt': '13pt',
        '14pt': '14pt'
    }
    setStylePropEditor(componentType, 'appearance', "fontSize", dropdown(fontSizes, '请选择字体大小'))
}

function setStylePropEditor(componentType: React.ComponentClass | string, group: string, name: keyof React.CSSProperties, editorType: PropEditorConstructor) {
    Component.setPropEditor(componentType, `style.${name}`, editorType, group)
}

jueying.strings = {
    layout: '布局',
    behavior: '行为',
    appearance: '外观',
}

let htmlTypes = ['table', 'thead', 'th', 'tbody', 'tfoot', 'tr', 'td']
htmlTypes.forEach(o => {
    setStyleEditor(o)
})