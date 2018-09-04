import React = require("react");
import { toPix } from "./baseControl";

interface Props {
    size: string | number,
    onChange: (size: string) => void
}
interface State {
    value: number,
    valueText: string,
}

export const controlUnit = 'mm'

/** 将长度转换为 mm */
export class ControlSize extends React.Component<Props, State>{
    constructor(props: Props) {
        super(props)

        let size = typeof this.props.size == 'number' ? `${this.props.size}px` : this.props.size
        let value = Number.parseFloat(ControlSize.toDefaultUnitSize(size))
        this.state = {
            value,
            valueText: value.toFixed(1),
        }
    }
    componentWillReceiveProps(props: Props) {
        let size = typeof props.size == 'number' ? `${props.size}px` : props.size
        // let value = ControlSize.toDefaultUnitSize(size)
        this.setState({ value: Number.parseFloat(ControlSize.toDefaultUnitSize(size)) })
    }

    /** 将尺寸转换为默认的值 */
    static toDefaultUnitSize(size: string | number): string {
        if (typeof size == 'number') {
            size = size + 'px'
        }

        let value = Number.parseFloat(size.substr(0, size.length - 2))
        let unit = size.substr(size.length - 2)

        console.assert(unit == 'px' || controlUnit)
        if (unit == controlUnit) {
            return `${value}${controlUnit}`
        }

        let scale = toPix(controlUnit)
        value = value / scale
        return `${value}${controlUnit}`
    }

    static toPXSize(size: string | number): number {
        if (typeof size == 'number')
            return size

        let value = Number.parseFloat(size.substr(0, size.length - 2))
        let unit = size.substr(size.length - 2)

        console.assert(unit == 'px' || controlUnit)
        if (unit == 'px') {
            return value
        }

        let scale = toPix(unit)
        value = value * scale
        return value
    }

    render() {
        let { value, valueText } = this.state
        return <div className="input-group">
            <input className="form-control" value={valueText}
                onChange={(e) => {
                    valueText = e.target.value
                    value = Number.parseFloat(valueText)
                    if (isNaN(value)) {
                        this.setState({ valueText })
                    }
                    else {
                        this.setState({ value, valueText });
                        this.props.onChange(`${value.toFixed(1)}${controlUnit}`)
                    }

                }} />
            <div className="input-group-addon">{controlUnit}</div>
        </div>
    }
}