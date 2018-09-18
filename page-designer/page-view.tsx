namespace jueying {
    export interface PageViewProps extends ControlProps<any> {
        style?: React.CSSProperties,
        className?: string,
        layout?: 'flowing' | 'absolute',
    }

    export const PageViewContext = React.createContext({ pageView: null as any as PageView })



    export type ControlPair = { control: Control<any, any>, controlType: React.ComponentClass<any> }
    export type State = {
    };

    /**
     * 移动端页面，将 PageData 渲染为移动端页面。
     */

    // @propEditor("name", "名称", "TextInput")
    export class PageView extends Control<PageViewProps, State>{

        static defaultProps: PageViewProps = { layout: 'flowing' }

        constructor(props: PageViewProps) {
            super(props);
        }

        get layout() {
            return this.props.layout;
        }

        render(h?: any) {
            let children = React.Children.toArray(this.props.children) || [];
            let pageData = { controls: [] };

            let pageView = this;
            return this.Element(<React.Fragment>
                <PageViewContext.Provider value={{ pageView }}>
                    {this.props.children}
                </PageViewContext.Provider>
            </React.Fragment>)
        }
    }

    ControlFactory.register(PageView);



    export interface PageViewEditorState extends PageViewProps {

    }
    export class PageViewEditor extends ControlEditor<EditorProps, PageViewEditorState>{
        render() {
            let { name, layout } = this.state;
            return this.Element(<React.Fragment>
                <div className="form-group">
                    <label>名称</label>
                    <div className="control">
                        <input className="form-control" value={name || ''}
                            onChange={(e) => {
                                name = (e.target as HTMLInputElement).value;
                                this.setState({ name });
                            }} />
                    </div>
                </div>
                <div className="form-group">
                    <label>布局</label>
                    <div className="control">
                        <select className="form-control" value={layout || ''} disabled >
                            <option value="flowing">流式定位</option>
                            <option value="absolute">绝对定位</option>
                        </select>
                    </div>
                </div>
            </React.Fragment>)
        }
    }

    ControlEditorFactory.register("PageView", PageViewEditor);
}

