import { Props as ControlProps, default as Control } from './control';
import { createBasePropEditors, cssProp } from "../baseControl";
import React = require("react");
import { ControlPropEditors, dropdown } from 'jueying';

// let fontSizes = ['8pt', '9pt', '10pt', '11pt', '12pt', '13pt', '14pt']
// export default class LabelEditor extends BaseControlEditor<ControlProps>{
//     static get defaultFontSize() {
//         return fontSizes[2];
//     }
//     renderControlProps(): JSX.Element {
//         let fontSize = this.state.fontSize || LabelEditor.defaultFontSize
//         let style = this.state.style || {}
//         return <>
//             <div className="form-group">
//                 <label>字体大小</label>
//                 <div className="control">
//                     <select className="form-control" value={fontSize || ''}
//                         onChange={(e) => {
//                             fontSize = e.target.value
//                             this.setState({ fontSize })
//                         }} >
//                         {fontSizes.map(o =>
//                             <option key={o} value={o}>{o}</option>
//                         )}
//                     </select>
//                 </div>
//             </div>
//             <div className="form-group">
//                 <label>宽</label>
//                 <div className="control">
//                     <ControlSize size={style.width}
//                         onChange={e => {
//                             style.width = e
//                             this.setState({ style })
//                         }} />
//                 </div>
//             </div>
//         </>
//     }

// }

(function () {

    createBasePropEditors(Control)
    let fontSizes = {
        '8pt': '8pt', '9pt': '9pt', '10pt': '10pt',
        '11pt': '11pt', '12pt': '12pt', '13pt': '13pt',
        '14pt': '14pt'
    }
    ControlPropEditors.setControlPropEditor<ControlProps, 'fontSize'>(Control, "fontSize", "字体大小", dropdown(fontSizes))

    // let func = function (style: React.CSSProperties, onChange: (value: React.CSSProperties) => void) {
    //     return <ControlSize size={style.width} onChange={e => {
    //         style.width = e
    //         onChange(style)
    //     }} />
    // }
    ControlPropEditors.setControlPropEditor<ControlProps, 'style'>(Control, "style", '宽', cssProp('width'))
    // ControlPropEditors.setControlPropEditor<ControlProps, 'field'>(Control, "field", '字段', textInput)
})()