import { PageDocument, Plugin, DesignerFramework, Workbench } from "jueying.forms";
import React = require("react");
import { DocumentFile } from "./page-document-handler";
import { TemplateDialog } from "./template-dialog";
import { DocumentFileStorage } from "./document-storage";
import { showDocumentListDialog } from "./dialogs/document-list-dialog";
import templates from './templates'
import { Errors } from "./errors";
import { Service } from "./service";

import { guid } from "jueying";

let buttonClassName = 'btn btn-default btn-sm'
interface ToolbarState {
    pageDocuments?: PageDocument[]
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
    async loadDocument(template: PageDocument, isNew: boolean): Promise<PageDocument> {
        let fileName = template.name
        console.assert(fileName);
        console.assert(template)

        let { pageDocuments } = this.state;
        let pageDocument: PageDocument

        if (isNew) {
            pageDocument = template
        }
        else {
            pageDocument = await this.storage.load(fileName);
            if (pageDocument == null) {
                throw Errors.fileNotExists(fileName);
            }

            pageDocument.name = fileName
        }

        let file = DocumentFile.create(this.storage, pageDocument, isNew)
        this.documentFiles[fileName] = file

        pageDocuments = pageDocuments || [];
        pageDocuments.push(pageDocument);
        this.setState({
            pageDocuments,
            currentField: file
        })

        this.props.ide.activeDocument = template
        return pageDocument
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
        // TemplateDialog.show({
        //     fetch: async (pageIndex, pageSize) => {
        //         let result = await this.storage.list(pageIndex, pageSize);
        //         let items = result.items
        //         let count = result.count;
        //         return { items: items as PageDocument[], count };
        //     },
        //     callback: (tmp) => {
        //         let docs = this.state.pageDocuments || [];
        //         let existDoc = docs.filter(o => o.name == tmp.name)[0];
        //         if (existDoc) {
        //             this.props.ide.activeDocument = existDoc
        //             return;
        //         }

        //         this.loadDocument(tmp, false);
        //     }
        // })
        showDocumentListDialog("选择打印模板", async (names) => {
            let service = new Service()
            for (let i = 0; i < names.length; i++) {
                let doc = await service.documentGet(names[i])
                this.loadDocument(doc, false)
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
        await currentField.save(this.props.ide.activeDocument)
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