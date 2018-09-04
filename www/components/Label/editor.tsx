import { Props as ControlProps } from './control';
import { BaseControlEditor } from "../baseControl";
import React = require("react");

let fontSizes = ['8pt', '9pt', '10pt', '11pt', '12pt', '13pt', '14pt']
export default class LabelEditor extends BaseControlEditor<ControlProps>{
    static get defaultFontSize() {
        return fontSizes[2];
    }
    renderControlProps(): JSX.Element {
        let fontSize = this.state.fontSize || LabelEditor.defaultFontSize
        return <>
            <div className="form-group">
                <label>字体</label>
                <div className="control">
                    <select className="form-control" value={fontSize}
                        onChange={(e) => {
                            fontSize = e.target.value
                            this.setState({ fontSize })
                        }} >
                        {fontSizes.map(o =>
                            <option key={o} value={o}>{o}</option>
                        )}
                    </select>
                </div>
            </div>
        </>
    }

}