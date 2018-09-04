import { Control, ControlProps } from "jueying";
import React = require("react");
import { BaseControl } from "../baseControl";

export interface Props extends ControlProps<Label> {
    text: string,
    fontSize?: string,
}

export default class Label extends BaseControl<Props, {}>{
    static defaultProps: Props = { text: '', fontSize: '10pt' }
    render() {
        let text = this.text()
        console.assert(text != null)
        let style: React.CSSProperties = { fontSize: this.props.fontSize }
        return this.Element({ style }, <>{this.text()}</>)
    }
}