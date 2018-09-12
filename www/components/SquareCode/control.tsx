import * as React from 'react';
import 'qrcode'
import { BaseControlProps, BaseControl } from "../baseControl";
import { ControlSize } from "../controls/controlSize";

export interface Props extends BaseControlProps<SquareCode> {
    // value: string,
    size: string,
    // field?: string,
}

export default class SquareCode extends BaseControl<Props, {}>{
    private img: HTMLImageElement

    constructor(props) {
        super(props)
    }
    static defaultProps: Props = { size: '12mm' }
    render(h?) {
        console.assert(h != null)
        let { size } = this.props
        return this.Element({ style: { height: size, width: size } },
            <img ref={e => this.img = e || this.img} style={{ width: '100%' }} />
        )
    }

    componentDidMount() {
        this.makeQRCode(this.element, this.img, this.text())
    }

    makeQRCode(element: HTMLElement, img: HTMLImageElement, value: string) {
        console.assert(element != null);

        let width = ControlSize.toPXSize(this.props.size)

        let qrcode = new QRCode(this.element, { width, height: width, text: "" });
        let q = qrcode as any;
        q._oDrawing._elImage = img; //this.element.querySelector('img');
        console.log(value);
        qrcode.makeCode(value);
    }

}