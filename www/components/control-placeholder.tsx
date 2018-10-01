import React = require("react");
import { BaseControlProps } from "components/baseControl";
import { component } from "jueying";


const defaultEmptyText = '可以从工具栏拖拉控件到这里'

export interface ControlPlaceholderState {
}
export interface ControlPlaceholderProps extends BaseControlProps<ControlPlaceholder> {
    style?: React.CSSProperties,
    emptyText?: string,
    htmlTag?: string,
    layout?: 'flowing' | 'absolute',
}

@(component({ container: true, movable: false }) as any)
export class ControlPlaceholder extends React.Component<ControlPlaceholderProps, ControlPlaceholderState> {
    render(h?: any) {
        let { emptyText, htmlTag } = this.props;

        let emptyElement = <div className="empty">{emptyText || defaultEmptyText}</div>;
        htmlTag = htmlTag || 'div';
        let controls = this.props.children as JSX.Element[] || [];
        return React.createElement(htmlTag,
            <React.Fragment>
                {controls.length == 0 ? emptyElement : controls}
            </React.Fragment>
        );
    }
}

