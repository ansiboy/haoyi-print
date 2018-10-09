import { component, Component, TextInput } from "jueying";
import { BaseControlProps, setStyleEditor, PageViewContext } from "./base-component";
import React = require("react");

export interface PageViewProps extends BaseControlProps<PageView> {
    data?: any,
}


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
    setStyleEditor(PageView.name)
    Component.setPropEditor(PageView.name, "name", TextInput, 'design')
}