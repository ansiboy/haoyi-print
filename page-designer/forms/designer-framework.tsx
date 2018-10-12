/// <reference path="templates.tsx"/>


namespace jueying.forms {
    export interface DesignerFrameworkProps {
        title?: string,
        templates: PageDocument[]
    }
    export interface DesignerFrameworkState {
        pageDocuments?: PageDocumentFile[]
        activeDocumentField?: PageDocumentFile
        addon?: DocumentPlugin,
    }
    // export class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState>{
    //     protected pageDesigner: PageDesigner;
    //     private _storage: DocumentStorage;
    //     private editorPanel: EditorPanel;
    //     private toolbarElement: HTMLElement;
    //     private changedManages: { [name: string]: JSONUndoRedo<ComponentData> }
    //     private editorPanelElement: HTMLElement;

    //     constructor(props) {
    //         super(props);

    //         this.state = {};
    //         this.changedManages = {}
    //     }

    //     renderButtons(activeDocument: PageDocumentFile, buttonClassName?: string) {
    //         buttonClassName = buttonClassName || 'btn btn-default'
    //         let isChanged = activeDocument ? activeDocument.notSaved : false;
    //         let buttons = [
    //             <button className={buttonClassName} disabled={!isChanged}
    //                 onClick={() => this.save()}>
    //                 <i className="icon-save" />
    //                 <span>保存</span>
    //             </button>,
    //             <button className={buttonClassName} disabled={this.changedManage == null || !this.changedManage.canRedo}
    //                 onClick={() => this.redo()}>
    //                 <i className="icon-repeat" />
    //                 <span>重做</span>
    //             </button>,
    //             <button className={buttonClassName} disabled={this.changedManage == null || !this.changedManage.canUndo}
    //                 onClick={() => this.undo()}>
    //                 <i className="icon-undo" />
    //                 <span>撤销</span>
    //             </button>,
    //             <button className={buttonClassName}>
    //                 <i className="icon-eye-open" />
    //                 <span>预览</span>
    //             </button>,
    //             <button className={buttonClassName} onClick={() => this.newFile()}>
    //                 <i className="icon-file" />
    //                 <span>新建</span>
    //             </button>,
    //             <button className={buttonClassName} onClick={() => this.open()}>
    //                 <i className="icon-folder-open" />
    //                 <span>打开</span>
    //             </button>,
    //         ]

    //         return buttons
    //     }

    //     get storage() {
    //         if (this._storage == null)
    //             this._storage = new LocalDocumentStorage();

    //         return this._storage;
    //     }

    //     static get dialogsElement() {
    //         let id = 'designer-framework-dialogs';
    //         let element = document.getElementById(id);
    //         if (!element) {
    //             element = document.createElement('div');
    //             element.id = id;
    //             document.body.appendChild(element);
    //         }

    //         return element;
    //     }

    //     get changedManage() {
    //         let activeDocument = this.state.activeDocumentField
    //         if (activeDocument == null)
    //             return null

    //         return this.changedManages[activeDocument.fileName]
    //     }

    //     //======================================================
    //     // Virtual Method
    //     undo() {
    //         let pageData = this.changedManage.undo()
    //         let { activeDocumentField } = this.state
    //         activeDocumentField.document.pageData = pageData
    //         this.setState({ activeDocumentField })
    //     }
    //     redo() {
    //         let pageData = this.changedManage.redo()
    //         let { activeDocumentField } = this.state
    //         activeDocumentField.document.pageData = pageData
    //         this.setState({ activeDocumentField })
    //     }
    //     async save() {
    //         let { activeDocumentField, pageDocuments } = this.state;
    //         let pageDocument = activeDocumentField
    //         console.assert(pageDocument != null);
    //         pageDocument.save();
    //         this.setState({ pageDocuments });
    //     }
    //     async loadDocument(template: PageDocument, isNew: boolean) {
    //         let fileName = template.name
    //         console.assert(fileName);
    //         console.assert(template)
    //         let { pageData } = template
    //         let { pageDocuments } = this.state;
    //         let documentStorage = this.storage
    //         let pageDocument = isNew ? PageDocumentFile.new(documentStorage, fileName, template) :
    //             await PageDocumentFile.load(documentStorage, fileName);

    //         this.changedManages[fileName] = new JSONUndoRedo(pageData)
    //         pageDocuments = pageDocuments || [];
    //         pageDocuments.push(pageDocument);
    //         let addon: DocumentPlugin
    //         if (template.plugin) {
    //             try {
    //                 let es = await chitu.loadjs(`${template.plugin}`)
    //                 console.log(`load addon ${template.plugin} success`)
    //                 console.assert(es.default != null)
    //                 addon = es.default
    //             }
    //             catch (e) {
    //                 console.log(`load addon ${template.plugin} fail`)
    //             }

    //         }

    //         this.setState({
    //             pageDocuments, addon,
    //             activeDocumentField: pageDocuments[pageDocuments.length - 1]
    //         })

    //     }
    //     async fetchTemplates() {
    //         let templates = this.props.templates
    //         return { items: templates, count: templates.length };
    //     }
    //     async newFile() {
    //         TemplateDialog.show({
    //             fetch: () => this.fetchTemplates(),
    //             requiredFileName: true,
    //             callback: (tmp) => {
    //                 this.loadDocument(tmp, true);
    //             }
    //         });
    //     }
    //     open() {
    //         TemplateDialog.show({
    //             fetch: async (pageIndex, pageSize) => {
    //                 let result = await this.storage.list(pageIndex, pageSize);
    //                 let items = result.items//.map(a => ({ name: a[0], pageData: a[1] }));
    //                 let count = result.count;
    //                 return { items: items as PageDocument[], count };
    //             },
    //             callback: (tmp) => {
    //                 let docs = this.state.pageDocuments || [];
    //                 let existDoc = docs.filter(o => o.fileName == tmp.name)[0];
    //                 if (existDoc) {
    //                     let index = docs.indexOf(existDoc);
    //                     this.activeDocument(index);
    //                     return;
    //                 }

    //                 this.loadDocument(tmp, false);
    //             }
    //         })
    //     }
    //     private activeDocument(index: number) {
    //         let { pageDocuments } = this.state;
    //         let doc = pageDocuments[index];
    //         console.assert(doc != null);

    //         this.setState({ activeDocumentField: doc });

    //         setTimeout(() => {
    //             let pageViewId: string = doc.document.pageData.props.id;
    //             console.assert(pageViewId != null, 'pageView id is null');
    //             console.assert(doc.document.pageData.type == 'PageView');

    //             this.pageDesigner.selectComponent(pageViewId);
    //         }, 50);
    //     }
    //     setState<K extends keyof DesignerFrameworkState>(
    //         state: (Pick<DesignerFrameworkState, K> | DesignerFrameworkState),
    //     ): void {
    //         super.setState(state);
    //     }
    //     private closeDocument(index: number) {
    //         let { pageDocuments } = this.state;
    //         console.assert(pageDocuments != null);

    //         let doc = pageDocuments[index];
    //         console.assert(doc != null);

    //         let close = () => {
    //             pageDocuments.splice(index, 1);

    //             let activeDocumentIndex = index > 0 ? index - 1 : 0
    //             let activeDocument = pageDocuments[activeDocumentIndex]
    //             this.setState({ pageDocuments, activeDocumentField: activeDocument, addon: null });
    //         }

    //         if (!doc.notSaved) {
    //             close();
    //             return;
    //         }

    //         ui.confirm({
    //             title: '提示',
    //             message: '该页面尚未保存，是否保存?',
    //             confirmText: '保存',
    //             cancelText: '不保存',
    //             confirm: async () => {
    //                 await doc.save();
    //                 close();
    //             },
    //             cancle: () => {
    //                 close();
    //                 return Promise.resolve()
    //             },

    //         })
    //     }
    //     designerRef(e: PageDesigner) {
    //         if (!e) return
    //         this.pageDesigner = e || this.pageDesigner
    //         let func = () => {
    //             let activeDocument = this.state.activeDocumentField
    //             this.changedManage.setChangedData(activeDocument.document.pageData)
    //             this.renderToolbar(this.toolbarElement)
    //             this.renderEditorPanel(this.editorPanelElement)
    //         }
    //         this.pageDesigner.componentRemoved.add(func)
    //         this.pageDesigner.componentAppend.add(func)
    //         this.pageDesigner.componentUpdated.add(func)
    //         this.pageDesigner.componentSelected.add(func)
    //     }
    //     renderToolbar(element: HTMLElement) {
    //         let pageDocument = this.state.activeDocumentField
    //         let buttons = this.renderButtons(pageDocument)
    //         let { title } = this.props
    //         ReactDOM.render(<React.Fragment>
    //             <li className="pull-left">
    //                 <h3>{title || ''}</h3>
    //             </li>
    //             {buttons.map((o, i) =>
    //                 <li key={i} className="pull-right">
    //                     {o}
    //                 </li>
    //             )}
    //         </React.Fragment>, element)
    //     }
    //     renderEditorPanel(element: HTMLElement) {
    //         ReactDOM.render(
    //             <EditorPanel emptyText={"未选中控件，点击页面控件，可以编辑选中控件的属性"}
    //                 designer={this.pageDesigner}
    //                 ref={e => this.editorPanel = e || this.editorPanel} />,
    //             element
    //         )
    //     }
    //     render() {
    //         let { activeDocumentField, pageDocuments, addon } = this.state;
    //         pageDocuments = pageDocuments || [];

    //         let pageDocument = activeDocumentField
    //         return <div className="designer-form">
    //             <ul className="toolbar clearfix"
    //                 ref={e => {
    //                     if (!e) return
    //                     this.toolbarElement = e
    //                     this.renderToolbar(this.toolbarElement)
    //                 }}>
    //             </ul>
    //             <div className="main-panel">
    //                 <ul className="nav nav-tabs" style={{ display: pageDocuments.length == 0 ? 'none' : null }}>
    //                     {pageDocuments.map((o, i) =>
    //                         <li key={i} role="presentation" className={o == activeDocumentField ? 'active' : null}
    //                             onClick={() => this.activeDocument(i)}>
    //                             <a href="javascript:">
    //                                 {o.fileName}
    //                                 <i className="pull-right icon-remove" style={{ cursor: 'pointer' }}
    //                                     onClick={(e) => {
    //                                         e.cancelable = true;
    //                                         e.stopPropagation();
    //                                         this.closeDocument(i);
    //                                     }} />
    //                             </a>
    //                         </li>
    //                     )}
    //                 </ul>
    //                 {pageDocument ?
    //                     <PageDesigner pageData={pageDocument.document.pageData} ref={e => this.designerRef(e)}>
    //                     </PageDesigner> : null}
    //             </div>
    //             <ComponentPanel className="component-panel" />
    //             <div ref={e => {
    //                 if (!e) return
    //                 this.editorPanelElement = e || this.editorPanelElement
    //                 this.renderEditorPanel(e)
    //             }}>
    //             </div>
    //         </div>
    //     }
    // }

    type DesignerFrameworkProps1 = DesignerFrameworkProps & {
        config: Confid
    }

    type DesignerFrameworkState1 = DesignerFrameworkState & {
        documents: PageDocument[],
        activeDocument?: PageDocument,
        buttons: JSX.Element[],
    }

    export class DesignerFramework1 extends React.Component<DesignerFrameworkProps1, DesignerFrameworkState1>{
        protected pageDesigner: PageDesigner;
        private editorPanel: EditorPanel;

        documentChanged: Callback<{ document: PageDocument }>;
        documentClosing: Callback<{ preventClose: boolean, document: PageDocument }>;
        documentClosed: Callback<{ document: PageDocument }>;
        documentActived: Callback<{ document: PageDocument, index: number }>;
        documentAdd: Callback<{ document: PageDocument }>;

        readonly plugins: (Plugin & { typeId: string })[];
        componentPanel: ComponentPanel;
        toolbarPanel: ToolbarPanel;

        constructor(props: DesignerFrameworkProps1) {
            super(props);

            //TODO: 校验 config 文件

            this.state = { documents: [], buttons: [] };

            this.documentChanged = Callback.create()
            this.documentClosing = Callback.create()
            this.documentClosed = Callback.create()
            this.documentActived = Callback.create()
            this.documentAdd = Callback.create()

            this.plugins = []
            props.config.plugins
                .filter(o => o.autoLoad)
                .forEach(o => {
                    this.loadPlugin(o.path, o.id)
                })
        }

        setActiveDocument(document: PageDocument) {
            let { documents } = this.state
            console.assert(document.name)

            let { targetDocument, index } = documents.filter(o => o.name == document.name)
                .map((o, index) => ({ targetDocument: o, index }))[0] || { targetDocument: null, index: -1 }

            if (!targetDocument) {
                documents.push(document)
                // this.setState({ documents })
                this.documentAdd.fire({ document })
                this.activeDocument(documents.length - 1)
                return
            }

            documents[index] = document
            this.setState({ documents })
            this.documentChanged.fire({ document })
            this.activeDocument(index)
            return true
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
        private async activeDocument(index: number) {
            let { documents } = this.state
            console.assert(index <= documents.length - 1)
            let doc = documents[index]
            this.setState({ activeDocument: doc })
            this.documentActived.fire({ document: doc, index })

            if (doc.plugin) {
                let pluginInfo = this.props.config.plugins.filter(o => o.id == doc.plugin)[0]
                if (pluginInfo == null) {
                    console.log(`Plugin ${doc.plugin} is not config`)
                }
                if (!pluginInfo.id) {
                    throw new Error(`Plugin id cannt null or empty.`)
                }
                pluginInfo.singleton = pluginInfo.singleton == null ? defaultPluginSingleton : pluginInfo.singleton

                console.assert(this.plugins != null)
                let plugin = this.plugins.filter(o => o.typeId.toLowerCase() == pluginInfo.id.toLowerCase())[0]
                if (plugin == null || pluginInfo.singleton == false) {
                    plugin = await this.loadPlugin(pluginInfo.path, pluginInfo.id)
                }

                let obj = plugin as any as DocumentPlugin
                if (obj.components) {
                    console.assert(this.componentPanel != null)
                    this.componentPanel.setComponets(obj.components)
                }
            }
        }

        //TODO: 防止 Plugin 重复加载
        private async loadPlugin(pluginPath: string, typeId: string) {
            try {
                let mod = await chitu.loadjs(pluginPath);
                console.assert(mod)

                let plugin: Plugin = mod.default
                console.assert(plugin)

                let obj = Object.assign(plugin, { typeId })
                this.plugins.push(obj);
                if (plugin.init)
                    plugin.init(this)

                return obj
            }
            catch (exc) {
                console.error(exc)
            }
        }

        private closeDocument(index: number) {

            let { documents } = this.state
            console.assert(documents != null)
            console.assert(index <= documents.length - 1)
            let document = documents[index]

            let args = { preventClose: false, document }
            this.documentClosing.fire(args)
            if (args.preventClose) {
                return false
            }

            documents.splice(index, 1)
            this.setState({ documents })

            this.documentClosed.fire({ document })
            if (documents.length > 0) {
                this.activeDocument(index > documents.length - 1 ? 0 : index)
            }

        }
        designerRef(e: PageDesigner, document: PageDocument) {
            if (!e) return
            this.pageDesigner = e || this.pageDesigner
            let func = () => {
                // let activeDocument = this.state.activeDocumentField
                // this.changedManage.setChangedData(activeDocument.document.pageData)
                // this.renderToolbar(this.toolbarElement)
                // this.renderEditorPanel(this.editorPanelElement)
                this.editorPanel.setState({ designer: e })
                this.documentChanged.fire({ document })
            }
            e.componentRemoved.add(func)
            e.componentAppend.add(func)
            e.componentUpdated.add(func)
            // this.pageDesigner.componentSelected.add(func)
        }
        // renderEditorPanel(element: HTMLElement) {
        //     ReactDOM.render(
        //         <EditorPanel emptyText={"未选中控件，点击页面控件，可以编辑选中控件的属性"}
        //             designer={this.pageDesigner}
        //             ref={e => this.editorPanel = e || this.editorPanel} />,
        //         element
        //     )
        // }
        render() {
            let { activeDocumentField, pageDocuments, documents } = this.state;
            pageDocuments = pageDocuments || [];

            return <div className="designer-form">
                <ToolbarPanel ref={e => this.toolbarPanel = e || this.toolbarPanel} />
                <div className="main-panel">
                    <ul className="nav nav-tabs" style={{ display: pageDocuments.length == 0 ? 'none' : null }}>
                        {pageDocuments.map((o, i) =>
                            <li key={i} role="presentation" className={o == activeDocumentField ? 'active' : null}
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
                    {documents.map(o =>
                        <PageDesigner key={o.name} pageData={o.pageData} ref={(e) => this.designerRef(e, o)} />
                    )}
                </div>
                <ComponentPanel className="component-panel" ref={e => this.componentPanel = e || this.componentPanel} />
                <EditorPanel emptyText={"未选中控件，点击页面控件，可以编辑选中控件的属性"}
                    designer={this.pageDesigner}
                    ref={e => this.editorPanel = e || this.editorPanel} />
            </div>
        }
    }
}

