import { PageDocument, Plugin, DesignerFramework } from "jueying.forms";
import React = require("react");
import { FileDocument } from "./page-document-handler";
import { guid } from "jueying";
import { TemplateDialog } from "./template-dialog";
import { DocumentFileStorage } from "./document-storage";

let buttonClassName = 'btn btn-default btn-sm'

interface ToolbarState {
    pageDocuments?: PageDocument[]
    activeDocument?: PageDocument
}
interface ToolbarProps {
    ide: DesignerFramework,
}
class Toolbar extends React.Component<ToolbarProps, ToolbarState>{

    _storage: any;
    documentFiles: { [key: string]: FileDocument }
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
            await FileDocument.load(documentStorage, fileName);


        let file = this.documentFiles[fileName]
        console.assert(file == null)
        file = FileDocument.new(this.storage, fileName, pageDocument)
        this.documentFiles[fileName] = file


        pageDocuments = pageDocuments || [];
        pageDocuments.push(pageDocument);
        this.setState({
            pageDocuments,
            activeDocument: pageDocuments[pageDocuments.length - 1]
        })


        this.props.ide.setActiveDocument(template)

    }
    getDocumentFile(document: PageDocument) {
        let file = this.documentFiles[document.name]
        // if (!file) {
        //     file = FileDocument.new(this.storage, document)
        //     this.documentFiles[document.name] = file
        // }
        console.assert(file)
        return this.documentFiles[document.name]
    }
    async fetchTemplates() {
        let templates = []
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
                    this.props.ide.setActiveDocument(existDoc)
                    return;
                }

                this.loadDocument(tmp, false);
            }
        })
    }
    undo() {
        let { activeDocument } = this.state
        let file = this.documentFiles[activeDocument.name]
        console.assert(file != null)
        activeDocument.pageData = file.undo()
        this.props.ide.setActiveDocument(activeDocument)
        this.setState({ activeDocument })
    }
    redo() {
        let { activeDocument } = this.state
        let file = this.getDocumentFile(activeDocument)
        activeDocument.pageData = file.redo()
        this.setState({ activeDocument })
        this.props.ide.setActiveDocument(activeDocument)
    }
    async save() {
        let { activeDocument } = this.state;
        let file = this.getDocumentFile(activeDocument)
        file.save(activeDocument);
        this.setState({ activeDocument });
    }
    componentDidMount() {
        this.props.ide.documentChanged.add(args => {
            let file = this.documentFiles[args.document.name]
            console.assert(file != null)
            file.setSnapShoot(args.document.pageData)
            this.setState({ activeDocument: args.document })
        })
        // this.props.ide.documentAdd.add(args => {
        //     let file = this.documentFiles[args.document.name]
        //     console.assert(file == null)
        //     file = FileDocument.new(this.storage, args.document)
        //     this.documentFiles[args.document.name] = file

        // })
    }
    render() {
        // let activeDocument = this.state.activeDocument
        // let { canRedo, canSave, canUndo } = (activeDocument == null ?
        //     { canRedo: false, canSave: false, canUndo: false } :
        //     this.documentFiles[activeDocument.name]
        // )
        let canRedo = false, canSave = false, canUndo = false
        let activeDocument = this.state.activeDocument
        if (activeDocument) {
            let file = this.documentFiles[activeDocument.name]
            console.assert(file)
            canRedo = file.canRedo
            canUndo = file.canUndo
            canSave = file.canSave
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

class DocumentPlugin implements Plugin {
    init(ide?: DesignerFramework) {

        let buttons = <Toolbar key={guid()} ide={ide} />
        ide.toolbarPanel.appendToolbar(buttons)
    }
}

export default new DocumentPlugin()