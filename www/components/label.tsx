import { component, Component } from "jueying";
import React = require("react");
import { BaseControl, BaseControlProps, compoentStyleEditors } from "./baseControl";

export interface Props extends BaseControlProps<Label> {
    text: string,
    fontSize?: string,
    fontFa?: string,
}

@compoentStyleEditors
@(component({ container: false, movable: true }) as any)
export default class Label extends BaseControl<Props, {}>{
    static defaultProps: Props = { text: '', fontSize: '10pt' }
    render() {
        let text = this.text()
        console.assert(text != null)
        let style = this.props.style
        return <div style={style}>
            {this.text()}
        </div>
    }
}

