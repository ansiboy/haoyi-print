namespace jueying.forms {
    export interface ToolbarState {
        toolbars: JSX.Element[]
    }
    export class ToolbarPanel extends React.Component<{}, ToolbarState>{
        constructor(props: {}) {
            super(props)
            this.state = { toolbars: [] }
        }
        appendToolbar(toolbar: JSX.Element) {
            if (toolbar == null)
                throw Errors.argumentNull('toolbar')

            if (!toolbar.key)
                throw Errors.toolbarRequiredKey()

            let arr = this.state.toolbars
            console.assert(arr)
            arr.push(toolbar)
            this.setState({ toolbars: arr })
        }
        render() {
            let { toolbars } = this.state
            console.assert(toolbars)
            return <ul className="toolbar">
                {toolbars.map((o, i) =>
                    <li key={i}>{o}</li>
                )}
            </ul>
        }
    }
}