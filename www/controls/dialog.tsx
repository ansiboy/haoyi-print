import React = require("react");

export interface DialogProps {
    title?: string
    confirm?: () => false | void
    cancel?: () => false | void
}

export interface DialogState {

}

export class Dialog extends React.Component<DialogProps, DialogState> {
    private element: HTMLElement

    show() {
        ui.showDialog(this.element)
    }
    hide() {
        ui.hideDialog(this.element);
    }
    confirm() {
        if (!this.props.confirm)
            return

        if (this.props.confirm() == false)
            return

        ui.hideDialog(this.element)
    }
    render() {

        let children: React.ReactNode[];
        if (this.props.children == null) {
            children = [];
        }
        else if (Array.isArray(this.props.children)) {
            children = this.props.children;
        }
        else {
            children = [this.props.children]
        }
        children = children.filter(o => o != null)

        let { title } = this.props
        return <div className="modal fade" ref={e => this.element = e || this.element}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close"
                            onClick={() => ui.hideDialog(this.element)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 className="modal-title">{title}</h4>
                    </div>
                    <div className="modal-body clearfix" style={{ minHeight: 200 }}>
                        {children.filter((o: React.ReactElement<any>) => o.type == 'section')}
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-default"
                            onClick={e => this.hide()}>
                            <i className="icon icon-reply" />
                            <span>取消</span>
                        </button>
                        <button className="btn btn-primary"
                            onClick={e => this.confirm()}>
                            <i className="icon icon-ok" />
                            <span>确定</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}