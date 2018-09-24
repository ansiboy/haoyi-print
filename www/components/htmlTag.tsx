import React = require("react");
import { component, ControlPropEditors, TextInput } from "jueying";
import { controlSize } from "./baseControl";

interface Props extends React.Props<HTMLTag> {
    tagName?: string,
    style?: React.CSSProperties,
}

@(component({ container: true, movable: true }) as any)
export class HTMLTag extends React.Component<Props, {}> {

    static defaultProps: Props = { tagName: 'div', style: { width: 50, height: 50 } }

    constructor(props) {
        super(props)
    }

    render() {
        let { tagName } = this.props
        let obj = {} as any
        for (let key in this.props) {
            let name = key as keyof Props
            if (name == 'tagName' || name == 'children')
                continue

            obj[key] = this.props[key]
        }

        obj.className = 'html-tag'
        // obj.style = Object.assign({ width: 50, height: 50 }, obj.style || {})

        let children = []
        if (this.props.children) {
            if (Array.isArray(this.props.children))
                children = this.props.children
            else
                children = [this.props.children]
        }

        return React.createElement(tagName, obj, ...children)
    }
}

if (jueying.PageDesigner) {
    ControlPropEditors.setControlPropEditor<Props, "tagName">(HTMLTag, "标记", TextInput, "tagName")
    ControlPropEditors.setControlPropEditor<Props, "style">(HTMLTag, "左", controlSize(), "style", "left")
    ControlPropEditors.setControlPropEditor<Props, "style">(HTMLTag, "顶", controlSize(), "style", "top")
    ControlPropEditors.setControlPropEditor<Props, "style">(HTMLTag, "宽", controlSize(), "style", "width")
    ControlPropEditors.setControlPropEditor<Props, "style">(HTMLTag, "高", controlSize(), "style", "height")
}