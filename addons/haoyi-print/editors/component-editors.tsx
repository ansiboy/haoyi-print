import { Component, TextInput, dropdown, PropEditorConstructor, PropEditor } from "jueying";
import React = require("react");
import { Service } from "../../../service";
import { PageViewProps } from "../components/page-view";

class PrinterDropdown extends PropEditor<{ value: string, printerNames?: string[] }, string> {
    constructor(props) {
        super(props)
        let service = new Service()
        service.printers().then(printers => {
            this.setState({ printerNames: printers })
        })
    }
    render() {
        let { value, printerNames } = this.state
        return <select className='form-control' value={value || ''}
            onChange={e => {
                value = e.target.value
                this.setState({ value })
                this.props.onChange(value)
            }}>
            <option value="">默认打印机</option>
            {(printerNames || []).map(o =>
                <option key={o} value={o}>{o}</option>
            )}
        </select>
    }
}

export function setStyleEditor(componentType: React.ComponentClass | string) {

    let field: keyof jueying.ComponentProps<any> = 'field'
    Component.setPropEditor(componentType, field, TextInput, 'data')

    field = 'name'
    Component.setPropEditor(componentType, field, TextInput, 'design')

    Component.setPropEditor(componentType, 'text', TextInput, 'appearance')
    Component.setPropEditor(componentType, 'className', TextInput, 'behavior')
    Component.setPropEditor(componentType, 'colSpan', TextInput, 'behavior')

    let printerProp: keyof PageViewProps = 'printer'
    Component.setPropEditor(componentType, printerProp, PrinterDropdown, 'behavior')

    let func = Component.setPropEditor;
    func(componentType, 'style.width', TextInput, 'layout')
    func(componentType, 'style.height', TextInput, 'layout')
    setStylePropEditor(componentType, 'layout', 'width', TextInput)
    setStylePropEditor(componentType, 'layout', 'height', TextInput)
    setStylePropEditor(componentType, 'layout', 'padding', TextInput)
    setStylePropEditor(componentType, 'layout', 'margin', TextInput)
    setStylePropEditor(componentType, 'layout', 'bottom', TextInput)
    setStylePropEditor(componentType, 'layout', 'left', TextInput)
    setStylePropEditor(componentType, 'layout', 'right', TextInput)
    setStylePropEditor(componentType, 'layout', 'top', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxHeight', TextInput)
    setStylePropEditor(componentType, 'layout', 'minWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'minHeight', TextInput)

    setStylePropEditor(componentType, 'behavior', 'display', dropdown(['', 'none']))
    setStylePropEditor(componentType, 'behavior', 'visibility', dropdown(['', 'hidden', 'visible']))
    setStylePropEditor(componentType, 'behavior', 'position', dropdown(['', 'absolute',
        'fixed', 'inherit', 'initial', 'relative', 'static', 'sticky', 'unset']))

    setStylePropEditor(componentType, 'appearance', 'background', TextInput)
    setStylePropEditor(componentType, 'appearance', 'border', TextInput)
    setStylePropEditor(componentType, 'appearance', 'borderBottom', TextInput)
    setStylePropEditor(componentType, 'appearance', 'borderLeft', TextInput)
    setStylePropEditor(componentType, 'appearance', 'borderRight', TextInput)
    setStylePropEditor(componentType, 'appearance', 'borderTop', TextInput)

    let fontSizes = {
        '8pt': '8pt', '9pt': '9pt', '10pt': '10pt',
        '11pt': '11pt', '12pt': '12pt', '13pt': '13pt',
        '14pt': '14pt'
    }
    setStylePropEditor(componentType, 'appearance', 'font', TextInput)
    setStylePropEditor(componentType, 'appearance', "fontSize", dropdown(fontSizes, '请选择字体大小'))
    setStylePropEditor(componentType, 'appearance', 'fontWeight', TextInput)

    setStylePropEditor(componentType, 'appearance', 'color', TextInput)
    setStylePropEditor(componentType, 'appearance', 'cursor', TextInput)
    setStylePropEditor(componentType, 'appearance', 'textAlign', dropdown(['', 'left', 'center', 'right']))


}

function setStylePropEditor(componentType: React.ComponentClass | string, group: string, name: keyof React.CSSProperties, editorType: PropEditorConstructor) {
    Component.setPropEditor(componentType, `style.${name}`, editorType, group)
}

jueying.strings = {
    layout: '布局',
    behavior: '行为',
    appearance: '外观',
    design: '设计',
    data: '数据'
}

let htmlTypes = [
    'div',
    'label',
    'table', 'thead', 'th', 'tbody', 'tfoot', 'tr', 'td',
    'ul', 'li',
]
htmlTypes.forEach(o => {
    setStyleEditor(o)
})



