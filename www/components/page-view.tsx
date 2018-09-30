import { component, ComponentPropEditor, TextInput, dropdown, ComponentProps, propsGroups } from "jueying";
import React = require("react");
import { BaseControlProps } from "./baseControl";
import { ControlSize } from "./controls/controlSize";

export interface PageViewProps extends BaseControlProps<PageView> {
    data?: any,
}

export const PageViewContext = React.createContext({ pageView: null as any as PageView })
export interface State {
};

/**
 * 移动端页面，将 PageData 渲染为移动端页面。
 */

@(component({ container: true, movable: false }) as any)
export class PageView extends React.Component<PageViewProps, State>{

    // static defaultProps?: PageViewProps = { className: 'page-view', layout: 'flowing' }

    constructor(props: PageViewProps) {
        super(props);
    }
    render() {
        return <div className={this.props.className} style={this.props.style} draggable={false}>
            <PageViewContext.Provider value={{ pageView: this }}>
                {this.props.children}
            </PageViewContext.Provider>
        </div>
    }
}

if (jueying.PageDesigner) {
    ComponentPropEditor.setControlPropEditor<PageViewProps, "name">(PageView, 'property', TextInput, "name")

    // let items = {
    //     flowing: '流式定位',
    //     absolute: '绝对定位'
    // }
    // ComponentPropEditor.setControlPropEditor<PageViewProps, "layout">(PageView, 'property', dropdown(items), "layout")
    ComponentPropEditor.setControlPropEditor<PageViewProps, "name">(PageView, 'property', TextInput, "name")
    ComponentPropEditor.setControlPropEditor<PageViewProps, "style">(PageView, 'property', ControlSize, "style", 'width')
}

function createHTMLTagEditors(controlClass: string) {
    ComponentPropEditor.setControlPropEditor<ComponentProps<any>, "name">(controlClass, 'property', TextInput, 'name')
    ComponentPropEditor.setControlPropEditor<ComponentProps<any>, "style">(controlClass, 'style', ControlSize, 'style', 'left')
    ComponentPropEditor.setControlPropEditor<ComponentProps<any>, "style">(controlClass, 'style', ControlSize, 'style', 'top')
}

let tags = ['table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'div']
tags.forEach(tag => createHTMLTagEditors(tag))



