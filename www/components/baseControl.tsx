import { ComponentProps, ComponentPropEditor, TextInput, PropEditorConstructor } from "jueying";
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

export function createBasePropEditors(controlClass: React.ComponentClass) {
    ComponentPropEditor.setControlPropEditor<BaseControlProps<any>, "name">(controlClass, 'property', TextInput, 'name')
    ComponentPropEditor.setControlPropEditor<BaseControlProps<any>, "text">(controlClass, 'property', TextInput, 'text')
    ComponentPropEditor.setControlPropEditor<BaseControlProps<any>, "field">(controlClass, 'property', TextInput, 'field')


    ComponentPropEditor.setControlPropEditor<BaseControlProps<any>, "style">(controlClass, 'style', ControlSize, 'style', 'left')
    ComponentPropEditor.setControlPropEditor<BaseControlProps<any>, "style">(controlClass, 'style', ControlSize, 'style', 'top')
}

export function setStyleEditor(componentType: React.ComponentClass) {
    type T = BaseControlProps<any>
    let func = ComponentPropEditor.setControlPropEditor;
    func<T, "style">(componentType, 'layout', TextInput, 'style', 'width')
    func<T, "style">(componentType, 'layout', TextInput, 'style', 'height')
    setStylePropEditor(componentType, 'layout', 'width', ControlSize)
    setStylePropEditor(componentType, 'layout', 'height', ControlSize)
    setStylePropEditor(componentType, 'layout', 'padding', TextInput)
    setStylePropEditor(componentType, 'layout', 'margin', TextInput)
    setStylePropEditor(componentType, 'layout', 'left', TextInput)
    setStylePropEditor(componentType, 'layout', 'top', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxHeight', TextInput)
    setStylePropEditor(componentType, 'layout', 'minWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'minHeight', TextInput)

    setStylePropEditor(componentType, 'behavior', 'display', TextInput)

    setStylePropEditor(componentType, 'appearance', 'backgroundColor', TextInput)
    setStylePropEditor(componentType, 'appearance', 'backgroundImage', TextInput)
    setStylePropEditor(componentType, 'appearance', 'backgroundRepeat', TextInput)
    setStylePropEditor(componentType, 'appearance', 'border', TextInput)
    setStylePropEditor(componentType, 'appearance', 'font', TextInput)
    setStylePropEditor(componentType, 'appearance', 'color', TextInput)
    setStylePropEditor(componentType, 'appearance', 'cursor', TextInput)
}

function setStylePropEditor(componentType: React.ComponentClass, group: string, name: keyof React.CSSProperties, editorType: PropEditorConstructor) {
    ComponentPropEditor.setControlPropEditor<BaseControlProps<any>, "style">(componentType, group, editorType, 'style', name)
}
