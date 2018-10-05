import { component, Component, TextInput } from "jueying";
import React = require("react");
import { setStyleEditor } from "./component-editors";
import { BaseControlProps } from "./base-component";

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
    Component.setPropEditor(PageView, "name", TextInput, 'design')
    setStyleEditor(PageView)
}





