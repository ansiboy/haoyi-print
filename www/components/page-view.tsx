import { component, ControlPropEditors, TextInput, dropdown } from "jueying";
import React = require("react");
import { BaseControlProps } from "./baseControl";
import { ControlSize } from "./controls/controlSize";

export interface PageViewProps extends BaseControlProps<PageView> {
    layout?: 'flowing' | 'absolute',
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
    ControlPropEditors.setControlPropEditor<PageViewProps, "name">(PageView, "名称", TextInput, "name")

    let items = {
        flowing: '流式定位',
        absolute: '绝对定位'
    }
    ControlPropEditors.setControlPropEditor<PageViewProps, "layout">(PageView, "布局", dropdown(items), "layout")
    ControlPropEditors.setControlPropEditor<PageViewProps, "name">(PageView, "名称", TextInput, "name")
    ControlPropEditors.setControlPropEditor<PageViewProps, "style">(PageView, "宽", ControlSize, "style", 'width')
}


