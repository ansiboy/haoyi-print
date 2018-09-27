import { BaseControl } from "../baseControl";
import { ComponentProps } from "jueying";
import React = require("react");

export interface Props extends ComponentProps<Image> {

}

export default class Image extends BaseControl<Props, {}>{
    static defaultProps: Props = {}
    render() {
        let text = this.text()
        console.assert(text != null)
        let style: React.CSSProperties = {}
        // return this.Element({ style }, <>{this.text()}</>)
        return <div style={style}>
            {this.text()}
        </div>
    }
} 