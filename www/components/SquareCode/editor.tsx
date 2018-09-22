import { createBasePropEditors } from "../baseControl";
import { Props as ControlProps, default as Control } from './control';
import { ControlSize } from "../controls/controlSize";
import { ControlPropEditors, PropEditor, PropEditorProps } from "jueying";



(function () {

    createBasePropEditors(Control);
    // let a = <div onMouseDown></div>;
    ControlPropEditors.setControlPropEditor<ControlProps, 'size'>(Control, '尺寸', ControlSize, "size")

})()