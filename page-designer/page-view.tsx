namespace jueying {
    export interface PageViewProps extends ControlPlaceholderProps {
        // style?: React.CSSProperties,
        // className?: string,
        // layout?: 'flowing' | 'absolute',
    }

    export const PageViewContext = React.createContext({ pageView: null as any as PageView })
    export type ControlPair = { control: Control<any, any>, controlType: React.ComponentClass<any> }
    export interface State extends ControlPlaceholderState {
    };

    /**
     * 移动端页面，将 PageData 渲染为移动端页面。
     */
    export class PageView extends ControlPlaceholder<PageViewProps, State>{

        static defaultProps: PageViewProps = { className: 'page-view', layout: 'flowing' }

        constructor(props: PageViewProps) {
            super(props);
        }

        render(h?: any) {
            return this.Element(<React.Fragment>
                <PageViewContext.Provider value={{ pageView: this }}>
                    {super.render(h)}
                </PageViewContext.Provider>
            </React.Fragment>)
        }
    }

    ControlFactory.register(PageView);
}

