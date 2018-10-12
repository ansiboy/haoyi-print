import { ComponentProps, Component, TextInput } from "jueying";
import * as React from 'react';
import { setStyleEditor } from "../editors/component-editors";
export { setStyleEditor }

export function propertyEditors<T extends { new(...args: any[]): {} }>(constructor: T) {
    if (!jueying.PageDesigner) {
        return
    }

    Component.setPropEditor(constructor.name, "name", TextInput, 'design')
    setStyleEditor(constructor.name)
    return constructor
}

export const DataContext = React.createContext({ data: {} as { [key: string]: any } })

export abstract class BaseControl<P extends ComponentProps<any>, S> extends React.Component<P, S> {
    constructor(props: P) {
        super(props);

        console.assert(this.render != null)
    }

    protected text(): string {
        if (this.props.text)
            return this.props.text

        if (this.props.field) {
            let text: string = null
            if (text == null)
                text = `[${this.props.field}]`

            return text;
        }

        return this.props.name
    }
}
