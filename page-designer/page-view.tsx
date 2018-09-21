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
    export class PageView extends Control<PageViewProps, State>{

        static defaultProps: PageViewProps = { layout: 'flowing' }

        constructor(props: PageViewProps) {
            super(props);
        }

        get layout() {
            return this.props.layout;
        }

        render(h?: any) {
            let pageView = this;
            return this.Element(<React.Fragment>
                <PageViewContext.Provider value={{ pageView }}>
                    {this.props.children}
                </PageViewContext.Provider>
            </React.Fragment>)
        }
    }

    ControlFactory.register(PageView);
}

