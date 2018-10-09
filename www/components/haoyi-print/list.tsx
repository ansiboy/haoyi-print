import { component } from "jueying";
import React = require("react");
import { BaseControl, propertyEditors } from "./base-component";

@propertyEditors
@(component({ container: true, movable: false }) as any)
export class ListHeader extends React.Component<any, any>{
    render() {
        let { style } = this.props
        return <div className='list-header' style={style}>
            {this.props.children || emptyText('这是列表头，可以拖拉控件到这里')}
        </div>
    }
}

@propertyEditors
@(component({ container: true, movable: false }) as any)
export class ListFooter extends React.Component<any, any>{
    render() {
        let { style } = this.props
        return <div className='list-footer' style={style}>
            {this.props.children || emptyText('这是列表脚，可以拖拉控件到这里')}
        </div>
    }
}

@propertyEditors
@(component({ container: true, movable: false }) as any)
export class ListBody extends React.Component<any, any>{
    render() {
        let { style } = this.props
        return <div className='list-body' style={style}>
            {this.props.children || emptyText('这是列表身，可以拖拉控件到这里')}
        </div>
    }
}

@propertyEditors
@(component({ container: true, movable: true, showHandler: true, resize: true }) as any)
export default class List extends BaseControl<any, any>{
    render() {
        let { style } = this.props
        return <div className='list' style={style}>
            {this.props.children}
        </div>
    }
}

function emptyText(text: string) {
    return <div className='empty-text'>{text}</div>
}

// setStyleEditor(List)
// setStyleEditor(ListHeader)
// setStyleEditor(ListBody)
// setStyleEditor(ListFooter)