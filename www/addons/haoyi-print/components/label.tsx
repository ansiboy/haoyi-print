import { component, ComponentProps } from "jueying";
import React = require("react");
import { BaseControl,  propertyEditors } from "./base-component";

export interface Props extends ComponentProps<Label> {
    text: string,
    fontSize?: string,
    fontFa?: string,
}

@propertyEditors
@(component({ container: false, movable: true }) as any)
export default class Label extends BaseControl<Props, {}>{
    static defaultProps: Props = { text: '', fontSize: '10pt' }
    render() {
        let text = this.text()
        console.assert(text != null)
        let style = this.props.style
        return <div className={this.props.className} style={style}>
            {this.text()}
        </div>
    }
}

