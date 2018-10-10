/// <reference path="templates.tsx"/>


namespace jueying.forms {
    export interface DesignerFrameworkProps {
        title?: string,
        templates: PageDocument[]
    }
    export interface DesignerFrameworkState {
        pageDocuments?: PageDocumentFile[]
        activeDocument?: PageDocumentFile
        // componentDefines: ComponentDefine[],
        addon?: Addon,
    }
    export class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState>{
        protected pageDesigner: PageDesigner;
        private _storage: DocumentStorage;
        private editorPanel: EditorPanel;
        private toolbarElement: HTMLElement;
        private changedManages: { [name: string]: JSONUndoRedo<ComponentData> }
        private editorPanelElement: HTMLElement;

        constructor(props) {
            super(props);

            this.state = {};
            this.changedManages = {}
        }

        renderButtons(activeDocument: PageDocumentFile, buttonClassName?: string) {
            buttonClassName = buttonClassName || 'btn btn-default'
            let isChanged = activeDocument ? activeDocument.notSaved : false;
            let addon = this.state.addon
            let buttons = [
                <button className={buttonClassName} disabled={!isChanged}
                    onClick={() => this.save()}>
                    <i className="icon-save" />
                    <span>保存</span>
                </button>,
                <button className={buttonClassName} disabled={this.changedManage == null || !this.changedManage.canRedo}
                    onClick={() => this.redo()}>
                    <i className="icon-repeat" />
                    <span>重做</span>
                </button>,
                <button className={buttonClassName} disabled={this.changedManage == null || !this.changedManage.canUndo}
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
            if (addon != null && addon.renderToolbarButtons) {
                buttons.push(...addon.renderToolbarButtons({ activeDocument }) || [])
            }

            return buttons
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

        get changedManage() {
            let activeDocument = this.state.activeDocument
            if (activeDocument == null)
                return null

            return this.changedManages[activeDocument.fileName]
        }

        //======================================================
        // Virtual Method
        undo() {
            let pageData = this.changedManage.undo()
            let { activeDocument } = this.state
            activeDocument.document.pageData = pageData
            this.setState({ activeDocument })
        }
        redo() {
            let pageData = this.changedManage.redo()
            let { activeDocument } = this.state
            activeDocument.document.pageData = pageData
            this.setState({ activeDocument })
        }
        async save() {
            let { activeDocument, pageDocuments } = this.state;
            let pageDocument = activeDocument
            console.assert(pageDocument != null);
            pageDocument.save();
            this.setState({ pageDocuments });
        }
        async loadDocument(template: PageDocument, isNew: boolean) {
            let fileName= template.name
            console.assert(fileName);
            console.assert(template)
            let { pageData } = template
            let { pageDocuments } = this.state;
            let documentStorage = this.storage
            let pageDocument = isNew ? PageDocumentFile.new(documentStorage, fileName, template) :
                await PageDocumentFile.load(documentStorage, fileName);

            this.changedManages[fileName] = new JSONUndoRedo(pageData)
            pageDocuments = pageDocuments || [];
            pageDocuments.push(pageDocument);
            let addon: Addon
            if (template.addonPath) {
                try {
                    let es = await chitu.loadjs(`${template.addonPath}/index`)
                    console.log(`load addon ${template.addonPath}/index success`)
                    console.assert(es.default != null)
                    addon = es.default
                    // components = addon.components || []
                    // this.setState({ addon })
                }
                catch (e) {
                    console.log(`load addon ${template.addonPath}/addon fail`)
                }

            }

            this.setState({
                pageDocuments, addon,
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
                callback: (tmp) => {
                    this.loadDocument(tmp, true);
                }
            });
        }
        open() {
            TemplateDialog.show({
                fetch: async (pageIndex, pageSize) => {
                    let result = await this.storage.list(pageIndex, pageSize);
                    let items = result.items//.map(a => ({ name: a[0], pageData: a[1] }));
                    let count = result.count;
                    return { items: items as PageDocument[], count };
                },
                callback: (tmp) => {
                    let docs = this.state.pageDocuments || [];
                    let existDoc = docs.filter(o => o.fileName == tmp.name)[0];
                    if (existDoc) {
                        let index = docs.indexOf(existDoc);
                        this.activeDocument(index);
                        return;
                    }

                    this.loadDocument(tmp, false);
                }
            })
        }
        private activeDocument(index: number) {
            let { pageDocuments } = this.state;
            let doc = pageDocuments[index];
            console.assert(doc != null);

            this.setState({ activeDocument: doc });

            setTimeout(() => {
                let pageViewId: string = doc.document.pageData.props.id;
                console.assert(pageViewId != null, 'pageView id is null');
                console.assert(doc.document.pageData.type == 'PageView');

                this.pageDesigner.selectComponent(pageViewId);
            }, 50);
        }
        setState<K extends keyof DesignerFrameworkState>(
            state: (Pick<DesignerFrameworkState, K> | DesignerFrameworkState),
        ): void {
            super.setState(state);
        }
        private closeDocument(index: number) {
            let { pageDocuments } = this.state;
            console.assert(pageDocuments != null);

            let doc = pageDocuments[index];
            console.assert(doc != null);

            let close = () => {
                pageDocuments.splice(index, 1);

                let activeDocumentIndex = index > 0 ? index - 1 : 0
                let activeDocument = pageDocuments[activeDocumentIndex]
                this.setState({ pageDocuments, activeDocument, addon: null });
            }

            if (!doc.notSaved) {
                close();
                return;
            }

            ui.confirm({
                title: '提示',
                message: '该页面尚未保存，是否保存?',
                confirmText: '保存',
                cancelText: '不保存',
                confirm: async () => {
                    await doc.save();
                    close();
                },
                cancle: () => {
                    close();
                    return Promise.resolve()
                },

            })
        }
        designerRef(e: PageDesigner) {
            if (!e) return
            this.pageDesigner = e || this.pageDesigner
            let func = () => {
                let activeDocument = this.state.activeDocument
                this.changedManage.setChangedData(activeDocument.document.pageData)
                this.renderToolbar(this.toolbarElement)
                this.renderEditorPanel(this.editorPanelElement)
            }
            this.pageDesigner.componentRemoved.add(func)
            this.pageDesigner.componentAppend.add(func)
            this.pageDesigner.componentUpdated.add(func)
            this.pageDesigner.componentSelected.add(func)
        }
        renderToolbar(element: HTMLElement) {
            let pageDocument = this.state.activeDocument
            let buttons = this.renderButtons(pageDocument)
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
        renderEditorPanel(element: HTMLElement) {
            ReactDOM.render(
                <EditorPanel emptyText={"未选中控件，点击页面控件，可以编辑选中控件的属性"}
                    designer={this.pageDesigner}
                    ref={e => this.editorPanel = e || this.editorPanel} />,
                element
            )
        }
        render() {
            let { activeDocument, pageDocuments, addon } = this.state;
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
                                    {o.fileName}
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
                        <PageDesigner pageData={pageDocument.document.pageData} ref={e => this.designerRef(e)}>
                        </PageDesigner> : null}
                </div>
                <ComponentPanel className="component-panel" componets={addon ? addon.components : []} />
                <div ref={e => {
                    if (!e) return
                    this.editorPanelElement = e || this.editorPanelElement
                    this.renderEditorPanel(e)
                }}>
                </div>
            </div>
        }
    }
}
