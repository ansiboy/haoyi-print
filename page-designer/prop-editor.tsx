namespace jueying {

    export interface PropEditor<T> {
        (value: T, onChange: (value: T) => void): React.ReactElement<any>;
    }

    export let textInput: PropEditor<string>
    textInput = (value: string, onChange: (value: string) => void) => {
        return <input className='form-control' value={value}
            onChange={e => onChange(e.target.value)} />
    }

    export function dropdown(items: { [value: string]: string }) {
        return (value: string, onChange: (value: string) => void) => {
            return <select className='form-control' value={value}
                onChange={e => onChange(e.target.value)}>
                {Object.getOwnPropertyNames(items).map(o =>
                    <option key={o} value={o}>{items[o]}</option>
                )}
            </select>
        }
    }

}