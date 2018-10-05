import { BaseControlProps } from "./baseControl";
import { Component, TextInput, dropdown, PropEditorConstructor } from "jueying";

export function setStyleEditor(componentType: React.ComponentClass | string) {
    type T = BaseControlProps<any>
    let func = Component.setPropEditor;
    func(componentType, 'style.width', TextInput, 'layout')
    func(componentType, 'style.height', TextInput, 'layout')
    setStylePropEditor(componentType, 'layout', 'width', TextInput)
    setStylePropEditor(componentType, 'layout', 'height', TextInput)
    setStylePropEditor(componentType, 'layout', 'padding', TextInput)
    setStylePropEditor(componentType, 'layout', 'margin', TextInput)
    setStylePropEditor(componentType, 'layout', 'left', TextInput)
    setStylePropEditor(componentType, 'layout', 'top', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'maxHeight', TextInput)
    setStylePropEditor(componentType, 'layout', 'minWidth', TextInput)
    setStylePropEditor(componentType, 'layout', 'minHeight', TextInput)

    setStylePropEditor(componentType, 'behavior', 'display', dropdown(['', 'none']))
    setStylePropEditor(componentType, 'behavior', 'visibility', dropdown(['', 'hidden', 'visible']))

    setStylePropEditor(componentType, 'appearance', 'background', TextInput)
    setStylePropEditor(componentType, 'appearance', 'border', TextInput)
    setStylePropEditor(componentType, 'appearance', 'font', TextInput)
    setStylePropEditor(componentType, 'appearance', 'color', TextInput)
    setStylePropEditor(componentType, 'appearance', 'cursor', TextInput)

    let fontSizes = {
        '8pt': '8pt', '9pt': '9pt', '10pt': '10pt',
        '11pt': '11pt', '12pt': '12pt', '13pt': '13pt',
        '14pt': '14pt'
    }
    setStylePropEditor(componentType, 'appearance', "fontSize", dropdown(fontSizes, '请选择字体大小'))
}

function setStylePropEditor(componentType: React.ComponentClass | string, group: string, name: keyof React.CSSProperties, editorType: PropEditorConstructor) {
    Component.setPropEditor(componentType, `style.${name}`, editorType, group)
}

jueying.strings = {
    layout: '布局',
    behavior: '行为',
    appearance: '外观',
}

let htmlTypes = ['table', 'thead', 'th', 'tbody', 'tfoot', 'tr', 'td']
htmlTypes.forEach(o => {
    setStyleEditor(o)
})