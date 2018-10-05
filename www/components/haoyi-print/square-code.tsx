import * as React from 'react';
import 'qrcode'
import { BaseControlProps, BaseControl } from "./base-component";
import { ControlSize } from "./controls/controlSize";
import { component } from 'jueying';

export interface Props extends BaseControlProps<SquareCode> {
    size: string,
}

@(component() as any)
export default class SquareCode extends BaseControl<Props, {}>{
    private img: HTMLImageElement
    element: HTMLElement;

    constructor(props) {
        super(props)
    }
    static defaultProps: Props = { size: '12mm' }
    render() {
        let { size } = this.props
        let style = this.props.style
        style.height = size
        style.width = size
        return <div {...{ style }}
            ref={e => this.element = e || this.element}>
            <img ref={e => this.img = e || this.img} style={{ width: '100%' }} />
        </div>
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