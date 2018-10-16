import { classNames } from "../template-dialog";
import React = require("react");
import ReactDOM = require("react-dom");
import { Service } from "../service";

type DocumentInfo = {
    name: string,
    selected: boolean
}
interface State {
    documentInfos?: DocumentInfo[],
    title?: string,
}

let styles = {
    documentItem: {
        width: 80,
        height: 80,
        textAlign: 'center',
        border: 'solid 1px',
        paddingTop: 10,
        marginRight: 10,
    } as React.CSSProperties,
    documentItemSelected: null as React.CSSProperties,
    dialogBody: {
        minHeight: 200
    } as React.CSSProperties,
}

styles.documentItemSelected = Object.assign({
    backgroundColor: 'black',
    color: 'white'
} as React.CSSProperties, styles.documentItem)

type ConfirmFunction = (names: string[]) => void
class DocumentListDialog extends React.Component<any, State>{
    confirm: ConfirmFunction
    constructor(props: any) {
        super(props)
        this.state = {}
    }

    render() {
        let { documentInfos, title } = this.state
        let selectedItems = (documentInfos || []).filter(o => o.selected)
        return <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" onClick={() => ui.hideDialog(dialog_element)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title">{title || ''}</h4>
                </div>
                <div className="modal-body clearfix" style={styles.dialogBody}>
                    <div className="form-group">
                        {documentInfos == null ?
                            <div className={classNames.loadingTemplates}>数据正在加载中</div> :
                            documentInfos.length == 0 ?
                                <div className={classNames.emptyTemplates}>暂无模版数据</div> :
                                <>
                                    {documentInfos.map((o, i) =>
                                        <div key={i} className={o.selected ? "pull-left selected" : "pull-left"}
                                            style={o.selected ? styles.documentItemSelected : styles.documentItem}
                                            onClick={(ev) => {
                                                if (!ev.ctrlKey) {
                                                    documentInfos.forEach(o => o.selected = false)
                                                    o.selected = true
                                                }
                                                else {
                                                    o.selected = !o.selected
                                                }
                                                this.setState({ documentInfos })
                                            }}>
                                            <span>{o.name}</span>
                                        </div>
                                    )}
                                </>
                        }
                    </div>
                </div>
                <div className="modal-footer">
                    <div className="pull-right">
                        <button className="btn btn-primary"
                            disabled={selectedItems.length == 0}
                            onClick={() => {
                                this.confirm(selectedItems.map(o => o.name))
                                ui.hideDialog(dialog_element)
                            }}>
                            <i className="icon-ok" />
                            <span>确定</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    }
}

let dialog_element = document.createElement('div');
dialog_element.className = `modal fade ${classNames.templateDialog}`;
document.body.appendChild(dialog_element);
let defaultInstance: DocumentListDialog;
ReactDOM.render(<DocumentListDialog ref={(e) => defaultInstance = e || defaultInstance} />, dialog_element);

export function showDocumentListDialog(title: string, callback: ConfirmFunction) {
    defaultInstance.confirm = callback
    let service = new Service()
    service.documentList().then(items => {
        let infos = items.map(o => ({ name: o.name, selected: false }))
        defaultInstance.setState({ documentInfos: infos })
    })
    defaultInstance.setState({ title })
    ui.showDialog(dialog_element)
}