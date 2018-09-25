import { component } from "jueying";
import React = require("react");
import { BaseControl, BaseControlProps } from "../baseControl";

export interface Props extends BaseControlProps<Label> {
    text: string,
    fontSize?: string,
    fontFa?: string,
}

@(component({ container: false, movable: true }) as any)
export default class Label extends BaseControl<Props, {}>{
    static defaultProps: Props = { text: '', fontSize: '10pt' }
    render() {
        let text = this.text()
        console.assert(text != null)
        let style = this.props.style
        return <div>
            {this.text()}
        </div>
    }
}