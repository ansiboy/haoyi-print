/// <reference path="templates.tsx"/>

namespace jueying.extentions {
    export interface DesignerFrameworkProps {
        components: jueying.ComponentDefine[],
        title?: string,
        templates?: DocumentData[]
    }
    export interface DesignerFrameworkState {
        changed: boolean,
        canUndo: boolean,
        canRedo: boolean,
        activeDocumentIndex?: number,
        pageDocuments?: PageDocument[]
    }
    export class DesignerFramework extends React.Component<DesignerFrameworkProps, DesignerFrameworkState>{
        protected pageDesigner: jueying.PageDesigner;
        private names: string[] = [];
        private _storage: DocumentStorage;
        private ruleElement: HTMLCanvasElement;

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
        private namedControl(control: jueying.ElementData) {
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
                this.namedControl(control.children[i]);
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
            let { activeDocumentIndex, pageDocuments } = this.state;
            let pageDocument = pageDocuments[activeDocumentIndex];
            console.assert(pageDocument != null);
            pageDocument.save();
            this.setState({ pageDocuments });
        }
        async createDocuemnt(fileName: string, pageData: ElementData, isNew: boolean) {
            console.assert(fileName);
            let { pageDocuments } = this.state;
            let documentStorage = this.storage
            let pageDocument = isNew ? PageDocument.new(documentStorage, fileName, pageData) :
                await PageDocument.load(documentStorage, fileName);

            pageDocuments = pageDocuments || [];
            pageDocuments.push(pageDocument);
            this.setState({
                pageDocuments,
                activeDocumentIndex: pageDocuments.length - 1
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

            this.setState({ activeDocumentIndex: index });

            setTimeout(() => {
                let pageViewId = doc.pageData.props.id;
                console.assert(pageViewId != null, 'pageView id is null');
                console.assert(doc.pageData.type == 'PageView');

                this.pageDesigner.selectControlById(pageViewId);
            }, 50);
        }
        setState<K extends keyof DesignerFrameworkState>(
            state: (Pick<DesignerFrameworkState, K> | DesignerFrameworkState),
        ): void {
            super.setState(state);
        }
        private closeDocument(index: number) {
            let { pageDocuments, activeDocumentIndex } = this.state;
            console.assert(pageDocuments != null);

            let doc = pageDocuments[index];
            console.assert(doc != null);

            let close = () => {
                pageDocuments.splice(index, 1);

                if (pageDocuments.length == 0) {
                    activeDocumentIndex = null;
                }
                else if (activeDocumentIndex > pageDocuments.length - 1) {
                    activeDocumentIndex = 0;
                }

                this.setState({ pageDocuments, activeDocumentIndex });
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
            debugger;
            var canvas = this.ruleElement
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            let ruler = new Ruler(canvas);

            ruler.render('#aaa', 'mm', 100);

            window.onresize = function () {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ruler.render('#aaa', 'mm', 100);
            }
        }
        render() {
            let { activeDocumentIndex, pageDocuments } = this.state;
            let { components, title } = this.props;

            pageDocuments = pageDocuments || [];
            console.assert(pageDocuments != null);
            let pageDocument = activeDocumentIndex != null ? pageDocuments[activeDocumentIndex] : null;
            return <PageDesigner pageData={pageDocument ? pageDocument.pageData : null}
                ref={(e) => this.pageDesigner = e || this.pageDesigner} >
                <DesignerContext.Consumer>
                    {c => {
                        let designer = c.designer;
                        let pageView: React.ReactElement<any>;
                        if (designer.pageData) {
                            this.namedControl(designer.pageData);
                            pageView = Control.create(designer.pageData);
                        }

                        let buttons = this.createButtons(pageDocument)

                        return <React.Fragment>
                            <ul className="toolbar clearfix">
                                <li className="pull-left">
                                    <h3>{title || ''}</h3>
                                </li>
                                {buttons.map((o, i) =>
                                    <li key={i} className="pull-right">
                                        {o}
                                    </li>
                                )}
                            </ul>
                            <hr style={{ margin: 0, borderWidth: 4 }} />
                            <ComponentToolbar className="component-panel" componets={components} />
                            <EditorPanel emptyText={"未选中控件，点击页面控件，可以编辑选中控件的属性"} />
                            <div className="main-panel"
                                onClick={(e) => {
                                    if (designer.pageData) {
                                        let pageViewId = designer.pageData.props.id
                                        designer.selectControlById(pageViewId);
                                    }
                                }}>
                                <canvas className='ruler' ref={e => this.ruleElement = e || this.ruleElement}></canvas>
                                {pageView ?
                                    <React.Fragment>
                                        <ul className="nav nav-tabs">
                                            {pageDocuments.map((o, i) =>
                                                <li key={i} role="presentation" className={i == activeDocumentIndex ? 'active' : null}
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
                                        <div className="page-container">
                                            {pageView}
                                        </div>
                                    </React.Fragment> :
                                    <div className={classNames.emptyDocument}>
                                        暂无打开的文档
                                    </div>
                                }
                            </div>
                        </React.Fragment>
                    }}
                </DesignerContext.Consumer>
            </PageDesigner>
        }
    }
}

