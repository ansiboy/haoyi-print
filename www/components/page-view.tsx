import { component, ControlPlaceholderProps, ControlPlaceholderState, ControlPropEditors, TextInput, ControlPlaceholder, dropdown } from "jueying";
import React = require("react");
import { BaseControlProps } from "./baseControl";

export interface PageViewProps extends BaseControlProps<PageView> {
    // style?: React.CSSProperties,
    // className?: string,
    layout?: 'flowing' | 'absolute',
    // id?: string,
    data?: any,
    // name?: string,
}

export const PageViewContext = React.createContext({ pageView: null as any as PageView })
export interface State extends ControlPlaceholderState {
};

/**
 * 移动端页面，将 PageData 渲染为移动端页面。
 */

@(component({ container: true }) as any)
export class PageView extends React.Component<PageViewProps, State>{

    // static defaultProps?: PageViewProps = { className: 'page-view', layout: 'flowing' }

    constructor(props: PageViewProps) {
        super(props);
    }
    render() {
        // return this.Element(<React.Fragment>
        //     <PageViewContext.Provider value={{ pageView: this }}>
        //         {super.render(h)}
        //     </PageViewContext.Provider>
        // </React.Fragment>)
        return <div className={this.props.className}>
            <PageViewContext.Provider value={{ pageView: this }}>
                {this.props.children}
            </PageViewContext.Provider>
        </div>
    }
}

ControlPropEditors.setControlPropEditor<PageViewProps, "name">(PageView, "名称", TextInput, "name")

let items = {
    flowing: '流式定位',
    absolute: '绝对定位'
}
ControlPropEditors.setControlPropEditor<PageViewProps, "layout">(PageView, "布局", dropdown(items), "layout")
ControlPropEditors.setControlPropEditor<ControlPlaceholderProps, "name">(ControlPlaceholder, "名称", TextInput, "name")


