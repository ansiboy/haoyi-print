/// <reference path="templates.tsx"/>

namespace jueying.extentions {
    export interface DesignerFrameworkProps {
        components: ComponentDefine[],
        title?: string,
        templates?: DocumentData[]
    }
    export interface DesignerFrameworkState {
        changed: boolean,
        canUndo: boolean,
        canRedo: boolean,
        pageDocuments?: PageDocument[]
        activeDocument?: PageDocument
    }
    export class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState>{
        protected pageDesigner: PageDesigner;
        private names: string[] = [];
        private _storage: DocumentStorage;
        private ruleElement: HTMLCanvasElement;
        private editorPanel: EditorPanel;
        private toolbarElement: HTMLElement;

        constructor(props) {
            super(props);

            this.state = {
                changed: false,
                canUndo: false,
                canRedo: false
            };
        }
        static defaultProps: DesignerFrameworkProps = {
            components: [], templates: templates
        }

        /** 对控件进行命名 */
        private namedControl(control: jueying.ComponentData) {
            console.assert(control.props)
            let props = control.props;
            if (!props.name) {
                let num = 0;
                let name: string;
                do {
                    num = num + 1;
                    name = `${control.type}${num}`;
                } while (this.names.indexOf(name) >= 0);

                this.names.push(name);
                props.name = name;
            }

            if (!props.id)
                props.id = guid();

            if (!control.children || control.children.length == 0) {
                return;
            }
            for (let i = 0; i < control.children.length; i++) {
                let child = control.children[i]
                if (typeof child != 'string')
                    this.namedControl(child);
            }
        }

        createButtons(pageDocument: PageDocument, buttonClassName?: string) {

            buttonClassName = buttonClassName || 'btn btn-default'
            let isChanged = pageDocument ? pageDocument.isChanged : false;
            return [
                <button className={buttonClassName} disabled={!isChanged}
                    onClick={() => this.save()}>
                    <i className="icon-save" />
                    <span>保存</span>
                </button>,
                <button className={buttonClassName}
                    onClick={() => this.redo()}>
                    <i className="icon-repeat" />
                    <span>重做</span>
                </button>,
                <button className={buttonClassName}
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
                </button>
            ]
        }

        get storage() {
            if (this._storage == null)
                this._storage = new LocalDocumentStorage();

            return this._storage;
        }

        static get dialogsElement() {
            let id = 'designer-framework-dialogs';
            let element = document.getElementById(id);
            if (!element) {
                element = document.createElement('div');
                element.id = id;
                document.body.appendChild(element);
            }

            return element;
        }

        //======================================================
        // Virtual Method


        undo() {
            // this.pageDesigner.undo();
        }
        redo() {
            // this.pageDesigner.redo();
        }
        async save() {
            let { activeDocument, pageDocuments } = this.state;
            let pageDocument = activeDocument //pageDocuments[activeDocumentIndex];
            console.assert(pageDocument != null);
            pageDocument.save();
            this.setState({ pageDocuments });
        }
        async createDocuemnt(fileName: string, pageData: ComponentData, isNew: boolean) {
            console.assert(fileName);
            let { pageDocuments } = this.state;
            let documentStorage = this.storage
            let pageDocument = isNew ? PageDocument.new(documentStorage, fileName, pageData) :
                await PageDocument.load(documentStorage, fileName);

            pageDocuments = pageDocuments || [];
            pageDocuments.push(pageDocument);
            this.setState({
                pageDocuments,
                activeDocument: pageDocuments[pageDocuments.length - 1]
            })
        }
        async fetchTemplates() {
            let templates = this.props.templates
            return { items: templates, count: templates.length };
        }
        async newFile() {
            TemplateDialog.show({
                fetch: () => this.fetchTemplates(),
                requiredFileName: true,
                callback: (tmp, fileName) => {
                    this.createDocuemnt(fileName, tmp.pageData, true);
                }
            });
        }
        open() {
            TemplateDialog.show({
                fetch: async (pageIndex, pageSize) => {
                    let result = await this.storage.list(pageIndex, pageSize);
                    let items = result.items.map(a => ({ name: a[0], pageData: a[1] }));
                    let count = result.count;
                    return { items, count };
                },
                callback: (tmp) => {
                    let fileName = tmp.name;
                    let docs = this.state.pageDocuments || [];
                    let existDoc = docs.filter(o => o.name == tmp.name)[0];
                    if (existDoc) {
                        let index = docs.indexOf(existDoc);
                        this.activeDocument(index);
                        return;
                    }

                    this.createDocuemnt(fileName, tmp.pageData, false);

                }
            })
        }
        private activeDocument(index: number) {
            let { pageDocuments } = this.state;
            let doc = pageDocuments[index];
            console.assert(doc != null);

            this.setState({ activeDocument: doc });

            setTimeout(() => {
                let pageViewId: string = doc.pageData.props.id;
                console.assert(pageViewId != null, 'pageView id is null');
                console.assert(doc.pageData.type == 'PageView');

                this.pageDesigner.selectComponent(pageViewId);
            }, 50);
        }
        setState<K extends keyof DesignerFrameworkState>(
            state: (Pick<DesignerFrameworkState, K> | DesignerFrameworkState),
        ): void {
            super.setState(state);
        }
        private closeDocument(index: number) {
            let { pageDocuments, activeDocument } = this.state;
            console.assert(pageDocuments != null);

            let doc = pageDocuments[index];
            console.assert(doc != null);

            let close = () => {
                pageDocuments.splice(index, 1);

                let activeDocumentIndex = index > 0 ? index - 1 : 0
                let activeDocument = pageDocuments[activeDocumentIndex]
                this.setState({ pageDocuments, activeDocument });
            }

            if (!doc.isChanged) {
                close();
                return;
            }

            ui.confirm({
                title: '提示',
                message: '该页面尚未保存，是否保存?',
                confirm: async () => {
                    await doc.save();
                    close();
                },
                cancle: () => {
                    close();
                }
            })
        }
        componentDidMount() {
        }
        designerRef(e: PageDesigner) {
            if (!e) return
            this.pageDesigner = e || this.pageDesigner
            this.pageDesigner.controlSelected.add((controlIds) => {
                let controlDatas = controlIds.map(o => this.pageDesigner.findComponentData(o))
                this.editorPanel.setControls(controlDatas, this.pageDesigner)
            })
            this.pageDesigner.componentUpdated.add((sender) => {
                console.assert(this.toolbarElement)
                this.renderToolbar(this.toolbarElement)
                let controlDatas = sender.selectedComponentIds.map(o => this.pageDesigner.findComponentData(o))
                this.editorPanel.setControls(controlDatas, this.pageDesigner)
            })
        }
        renderToolbar(element: HTMLElement) {
            let pageDocument = this.state.activeDocument
            let buttons = this.createButtons(pageDocument)
            let { title } = this.props
            ReactDOM.render(<React.Fragment>
                <li className="pull-left">
                    <h3>{title || ''}</h3>
                </li>
                {buttons.map((o, i) =>
                    <li key={i} className="pull-right">
                        {o}
                    </li>
                )}
            </React.Fragment>, element)
        }
        render() {
            let { activeDocument, pageDocuments } = this.state;
            let { components } = this.props;

            pageDocuments = pageDocuments || [];
            let pageDocument = activeDocument
            return <div className="designer-form">
                <ul className="toolbar clearfix"
                    ref={e => {
                        if (!e) return
                        this.toolbarElement = e
                        this.renderToolbar(this.toolbarElement)
                    }}>
                </ul>
                <div className="main-panel">
                    <ul className="nav nav-tabs" style={{ display: pageDocuments.length == 0 ? 'none' : null }}>
                        {pageDocuments.map((o, i) =>
                            <li key={i} role="presentation" className={o == activeDocument ? 'active' : null}
                                onClick={() => this.activeDocument(i)}>
                                <a href="javascript:">
                                    {o.name}
                                    <i className="pull-right icon-remove" style={{ cursor: 'pointer' }}
                                        onClick={(e) => {
                                            e.cancelable = true;
                                            e.stopPropagation();
                                            this.closeDocument(i);
                                        }} />
                                </a>
                            </li>
                        )}
                    </ul>
                    {pageDocument ?
                        <PageDesigner pageData={pageDocument.pageData} ref={e => this.designerRef(e)}>
                        </PageDesigner> : null}
                </div>
                <ComponentToolbar className="component-panel" componets={components} />
                <EditorPanel emptyText={"未选中控件，点击页面控件，可以编辑选中控件的属性"}
                    ref={e => this.editorPanel = e || this.editorPanel} />

            </div>
        }
    }
}

