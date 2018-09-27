import { createBasePropEditors } from "../baseControl";
import { Props as ControlProps, default as Control } from './control';
import { ControlSize } from "../controls/controlSize";
import { ComponentPropEditor, PropEditor, PropEditorProps } from "jueying";



(function () {

    createBasePropEditors(Control);
    // let a = <div onMouseDown></div>;
    ComponentPropEditor.setControlPropEditor<ControlProps, 'size'>(Control, 'style', ControlSize, "size")

})()