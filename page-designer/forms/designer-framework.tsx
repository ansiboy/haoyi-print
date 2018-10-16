/// <reference path="templates.tsx"/>


namespace jueying.forms {
    type DesignerFrameworkProps = {
        config: Config
    }

    type DesignerFrameworkState = {
        documents: PageDocument[],
        activeDocument?: PageDocument,
        buttons: JSX.Element[],
    }

    /**
     * 通过 Workbench，对插件开放的接口
     */
    export interface Workbench {
        activeDocument
    }

    export class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState>{
        protected pageDesigner: PageDesigner;
        private editorPanel: EditorPanel;
        private workbench: Workbench

        documentChanged: Callback<{ document: PageDocument }>;
        documentClosing: Callback<{ preventClose: boolean, document: PageDocument }>;
        documentClosed: Callback<{ document: PageDocument }>;
        documentActived: Callback<{ document: PageDocument, index: number }>;
        documentAdd: Callback<{ document: PageDocument }>;

        readonly plugins: (Plugin & { typeId: string })[];
        componentPanel: ComponentPanel;
        toolbarPanel: ToolbarPanel;

        constructor(props: DesignerFrameworkProps) {
            super(props);

            //TODO: 校验 config 文件

            this.state = { documents: [], buttons: [] };

            this.documentChanged = Callback.create()
            this.documentClosing = Callback.create()
            this.documentClosed = Callback.create()
            this.documentActived = Callback.create()
            this.documentAdd = Callback.create()

            this.workbench = this.createWorkbench()

            this.plugins = []
            this.loadPlugins()

            this.documentChanged.add(args => {
                this.plugins.forEach(o => {
                    if (!o.onDocumentChanged)
                        return

                    o.onDocumentChanged({ document: args.document })
                })
            })
        }

        private loadPlugins() {
            let process: NodeJS.Process = window['process']
            let isDestop: boolean = process != null && process.versions != null && process.versions['electron'] != null
            let arr = this.props.config.plugins
                .filter((o, i) => {
                    if (o.autoLoad == 'all')
                        return true

                    if (isDestop) {
                        return o.autoLoad == 'desktop'
                    }

                    return o.autoLoad == 'browser'
                })
                .map(o => this.loadPlugin(o.path, o.id))

            Promise.all(arr)
                .then(() => this.initPlugins())
                .catch(() => this.initPlugins())
        }

        private createWorkbench(): Workbench {
            let self = this
            let obj: Workbench = {
                get activeDocument() {
                    return self.state.activeDocument
                },
                set activeDocument(value) {
                    self.setActiveDocument(value)
                }
            }

            return obj
        }

        private initPlugins() {
            // 对 plugins 进行按顺序排列
            let plugins = this.props.config.plugins
                .map(o => this.plugins.filter(c => c.typeId == o.id)[0])
                .filter(o => o != null)
                
            for (let i = 0; i < plugins.length; i++) {
                let plugin = plugins[i]
                if (plugin.init) {
                    let result = plugin.init(this.workbench) || {}
                    if (result.toolbar) {
                        this.toolbarPanel.appendToolbar(result.toolbar)
                    }
                }
            }
        }

        private setActiveDocument(document: PageDocument) {
            let { documents } = this.state
            console.assert(document.name)

            let { targetDocument, index } = documents.filter(o => o.name == document.name)
                .map((o, index) => ({ targetDocument: o, index }))[0] || { targetDocument: null, index: -1 }

            if (!targetDocument) {
                documents.push(document)
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

                if (plugin == null)
                    throw Errors.loadPluginFail(doc.plugin)

                if (plugin.onDocumentActived) {
                    let result = plugin.onDocumentActived({ document: doc })
                    if (result.components) {
                        this.componentPanel.setComponets(result.components)
                    }
                }
            }
        }

        //TODO: 防止 Plugin 重复加载
        private async loadPlugin(pluginPath: string, typeId: string): Promise<Plugin & { typeId: string }> {
            try {
                let mod = await chitu.loadjs(pluginPath);
                console.assert(mod)

                let plugin: Plugin = mod.default
                console.assert(plugin)

                let obj = Object.assign(plugin, { typeId })
                this.plugins.push(obj);

                return obj
            }
            catch (exc) {
                console.error(exc)
                return null
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

            this.pageDesigner.componentSelected.add(() => {
                this.editorPanel.setState({ designer: e })
            })
        }

        render() {
            let { activeDocument, documents } = this.state;
            console.assert(document != null)

            return <div className="designer-form">
                <ToolbarPanel ref={e => this.toolbarPanel = e || this.toolbarPanel} />
                <div className="main-panel">
                    <ul className="nav nav-tabs" style={{ display: documents.length == 0 ? 'none' : null }}>
                        {documents.map((o, i) =>
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
                    {documents.map(o =>
                        <PageDesigner key={o.name} pageData={o.pageData}
                            style={{ display: o == activeDocument ? null : 'none' }}
                            ref={(e) => this.designerRef(e, o)} />
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

