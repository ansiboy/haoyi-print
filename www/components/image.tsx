import { BaseControl } from "./base-component";
import { ComponentProps, Component, TextInput } from "jueying";
import React = require("react");

export interface Props extends ComponentProps<Image> {

}

export default class Image extends BaseControl<Props, {}>{
    static defaultProps: Props = {}
    render() {
        let text = this.text()
        console.assert(text != null)
        let style: React.CSSProperties = {}
        return <div style={style}>
            {this.text()}
        </div>
    }
}

Component.setPropEditor(Image, '', TextInput, 'name')