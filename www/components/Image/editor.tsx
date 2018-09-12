import { BaseControlEditor } from "../baseControl";
import { Props as ControlProps } from './control';

export default class Editor extends BaseControlEditor<ControlProps>{
    renderControlProps(): JSX.Element {
        throw new Error("Method not implemented.");
    }

}