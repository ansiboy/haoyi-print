namespace jueying {

    export interface PropEditorConstructor {
        new(props: PropEditorProps<any>)
    }
    export interface PropEditorProps<T> {
        value: T,
        onChange: (value: T) => void
    }
    export interface PropEditorState<T> {
        value: T
    }
    export abstract class PropEditor<S extends PropEditorState<T>, T> extends React.Component<PropEditorProps<T>, S> {
        constructor(props: PropEditorProps<T>) {
            super(props)

            this.state = { value: props.value } as PropEditorState<T> as any
        }


        componentWillReceiveProps(props: PropEditorProps<T>) {
            this.setState({ value: props.value })
        }
    }

    export class TextInput extends PropEditor<PropEditorState<string>, string> {
        render() {
            let { value } = this.state
            return <input className='form-control' value={value as any || ''}
                onChange={e => {
                    this.setState({ value: e.target.value })
                    this.props.onChange(e.target.value)
                }} />
        }
    }

    // export function textInput(value: string, onChange: (value: string) => void) {
    //     return <TextInput value={value} onChange={onChange} />
    // }



    export function dropdown(items: { [value: string]: string }) {
        // return (value: T, onChange: (value: T) => void) => {
        //     return <select className='form-control' value={value as any || ''}
        //         onChange={e => onChange(e.target.value as any)}>
        //         {Object.getOwnPropertyNames(items).map(o =>
        //             <option key={o} value={o}>{items[o]}</option>
        //         )}
        //     </select>
        // }

        return class Dropdown extends PropEditor<{ value: string }, string>{
            render() {
                let { value } = this.state
                return <select className='form-control' value={value as any || ''}
                    onChange={e => {
                        value = e.target.value
                        this.setState({ value })
                        this.props.onChange(value)
                    }}>
                    {Object.getOwnPropertyNames(items).map(o =>
                        <option key={o} value={o}>{items[o]}</option>
                    )}
                </select>
            }
        }

    }

}