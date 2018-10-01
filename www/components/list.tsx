import { component } from "jueying";
import React = require("react");
import { BaseControl } from "./baseControl";

@(component({ container: true, movable: false }) as any)
class ListHeader extends React.Component<any, any>{
    render() {
        return <div className='list-header' style={{ height: 40 }}>
            {this.props.children || 'list-header'}
        </div>
    }
}

@(component({ container: true, movable: false }) as any)
class ListFooter extends React.Component<any, any>{
    render() {
        return <div className='list-footer' style={{ height: 40 }}>
            {this.props.children || 'list-footer'}
        </div>
    }
}

@(component({ container: true, movable: false }) as any)
class ListBody extends React.Component<any, any>{
    render() {
        return <div className='list-body' style={{ height: 40 }}>
            {this.props.children || 'list-boyd'}
        </div>
    }
}

@(component({ container: true, movable: true, showHandler: true }) as any)
export default class List extends BaseControl<any, any>{
    render() {
        return <div className='list' style={{ height: 'auto', width: 300, paddingTop: 10 }}>
            {this.props.children}
        </div>
    }
}