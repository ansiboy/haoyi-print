import { createBasePropEditors } from "../baseControl";
import { Props as ControlProps, default as Control } from './control';
import React = require("react");
import { ControlSize } from "../controls/controlSize";
import { ControlPropEditors, PropEditor, PropEditorProps } from "jueying";

// export default class SquareCodeEditor extends BaseControlEditor<ControlProps>{
//     renderControlProps(): JSX.Element {
//         let { size, field } = this.state
//         return <>
//             <div className="form-group">
//                 <label>尺寸</label>
//                 <div className="control">
//                     <ControlSize size={size}
//                         onChange={size => {
//                             this.setState({ size })
//                         }} />
//                 </div>
//             </div>
//             <div className="form-group">
//                 <label>字段</label>
//                 <div className="control">
//                     <input className="form-control" value={field || ''}
//                         onChange={(e) => {
//                             field = e.target.value;
//                             this.setState({ field });
//                         }} />
//                 </div>
//             </div>
//         </>
//     }
// }

(function () {

    createBasePropEditors(Control)
    class PropEditorWraper extends PropEditor<PropEditorProps<string>, string>{
        render() {
            return <ControlSize size={this.state.value} onChange={e => this.props.onChange(e)} />
        }
    }

    ControlPropEditors.setControlPropEditor<ControlProps, 'size'>(Control, '尺寸', PropEditorWraper, "size")

})()