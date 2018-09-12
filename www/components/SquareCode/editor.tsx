import { BaseControlEditor } from "../baseControl";
import { Props as ControlProps } from './control';
import React = require("react");
import { ControlSize } from "../controls/controlSize";

export default class SquareCodeEditor extends BaseControlEditor<ControlProps>{
    renderControlProps(): JSX.Element {
        let { size, field } = this.state
        return <>
            <div className="form-group">
                <label>尺寸</label>
                <div className="control">
                    <ControlSize size={size}
                        onChange={size => {
                            this.setState({ size })
                        }} />
                </div>
            </div>
            <div className="form-group">
                <label>字段</label>
                <div className="control">
                    <input className="form-control" value={field || ''}
                        onChange={(e) => {
                            field = e.target.value;
                            this.setState({ field });
                        }} />
                </div>
            </div>
        </>
    }
}