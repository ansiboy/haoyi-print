import { PageDocument, Plugin, DesignerFramework, Workbench } from "jueying.forms";
import React = require("react");
import { DocumentFile } from "./page-document-handler";
import { guid } from "jueying";
import { TemplateDialog } from "./template-dialog";
import { DocumentFileStorage } from "./document-storage";
import templates from './templates'


let buttonClassName = 'btn btn-default btn-sm'

interface ToolbarState {
    pageDocuments?: PageDocument[]
    // activeDocument?: PageDocument,
    currentField?: DocumentFile
}
interface ToolbarProps {
    ide: Workbench,
}
class Toolbar extends React.Component<ToolbarProps, ToolbarState>{

    _storage: any;
    documentFiles: { [key: string]: DocumentFile }
    constructor(props: ToolbarProps) {
        super(props)
        this.state = {}
        this.documentFiles = {}
    }

    get storage() {
        if (this._storage == null)
            this._storage = new DocumentFileStorage();

        return this._storage;
    }
    async loadDocument(template: PageDocument, isNew: boolean) {
        let fileName = template.name
        console.assert(fileName);
        console.assert(template)

        let { pageDocuments } = this.state;
        let documentStorage = this.storage
        let pageDocument = isNew ? template :
            await DocumentFile.load(documentStorage, fileName);

        let file = DocumentFile.new(this.storage, pageDocument)
        this.documentFiles[fileName] = file


        pageDocuments = pageDocuments || [];
        pageDocuments.push(pageDocument);
        this.setState({
            pageDocuments,
            currentField: file
        })


        this.props.ide.activeDocument = template

    }
    getDocumentFile(document: PageDocument) {
        let file = this.documentFiles[document.name]
        console.assert(file)
        return this.documentFiles[document.name]
    }
    async fetchTemplates() {
        return { items: templates, count: templates.length };
    }
    async newFile() {
        TemplateDialog.show({
            fetch: () => this.fetchTemplates(),
            requiredFileName: true,
            callback: (tmp) => {
                this.loadDocument(tmp, true);
            }
        });
    }
    open() {
        TemplateDialog.show({
            fetch: async (pageIndex, pageSize) => {
                let result = await this.storage.list(pageIndex, pageSize);
                let items = result.items
                let count = result.count;
                return { items: items as PageDocument[], count };
            },
            callback: (tmp) => {
                let docs = this.state.pageDocuments || [];
                let existDoc = docs.filter(o => o.name == tmp.name)[0];
                if (existDoc) {
                    this.props.ide.activeDocument = existDoc
                    return;
                }

                this.loadDocument(tmp, false);
            }
        })
    }
    undo() {
        let { currentField } = this.state
        console.assert(currentField != null)
        currentField.undo()
        this.props.ide.activeDocument = currentField.document
        this.setState({ currentField })
    }
    redo() {
        let { currentField } = this.state
        currentField.redo()
        this.setState({ currentField })
        this.props.ide.activeDocument = currentField.document
    }
    async save() {
        let { currentField } = this.state;
        await currentField.save()
        this.setState({ currentField });
    }
    componentDidMount() {
    }
    onDocumentChanged(document: PageDocument) {
        let file = this.documentFiles[document.name]
        console.assert(file != null)
        file.setSnapShoot(document.pageData)
        this.setState({ currentField: file })
    }
    render() {
        let canRedo = false, canSave = false, canUndo = false
        let currentField = this.state.currentField
        if (currentField) {
            // let file = this.documentFiles[activeDocument.name]
            canRedo = currentField.canRedo
            canUndo = currentField.canUndo
            canSave = currentField.canSave
        }

        let buttons = [
            <button className={buttonClassName} disabled={!canSave}
                onClick={() => this.save()}>
                <i className="icon-save" />
                <span>保存</span>
            </button>,
            <button className={buttonClassName} disabled={!canRedo}
                onClick={() => this.redo()}>
                <i className="icon-repeat" />
                <span>重做</span>
            </button>,
            <button className={buttonClassName} disabled={!canUndo}
                onClick={() => this.undo()}>
                <i className="icon-undo" />
                <span>撤销</span>
            </button>,
            <button className={buttonClassName}>
                <i className="icon-eye-open" />
                <span>预览</span>
            </button>,
            <button className={buttonClassName} onClick={() => this.newFile()}>
                <i className="icon-file" />
                <span>新建</span>
            </button>,
            <button className={buttonClassName} onClick={() => this.open()}>
                <i className="icon-folder-open" />
                <span>打开</span>
            </button>,
        ]

        return <ul>
            {buttons.map((o, i) =>
                <li key={i} className="pull-right">{o}</li>
            )}
        </ul>
    }
}

let toolbar: Toolbar
let documentPlugin: Plugin = {
    init(ide?: Workbench) {

        let buttons = <Toolbar key={guid()} ide={ide}
            ref={e => toolbar = e || toolbar} />

        return { toolbar: buttons }
    },
    onDocumentChanged(args) {
        console.assert(toolbar != null)
        console.assert(args != null && args.document != null)
        toolbar.onDocumentChanged(args.document)
    }
}

export default documentPlugin