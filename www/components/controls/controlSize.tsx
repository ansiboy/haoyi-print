import React = require("react");

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
            valueText: isNaN(value) ? '' : value.toFixed(1),
        }
    }
    componentWillReceiveProps(props: Props) {
        let size = typeof props.size == 'number' ? `${props.size}px` : props.size
        let value = Number.parseFloat(ControlSize.toDefaultUnitSize(size))
        let valueText = isNaN(value) ? '' : value.toFixed(1)
        this.setState({ value, valueText })
    }

    /** 将尺寸转换为默认的值 */
    static toDefaultUnitSize(size: string | number): string {
        if (size == null || size == '')
            return size as string

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
        return `${value.toFixed(1)}${controlUnit}`
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

export let toPix = (function () {

    // cache con, el for reused
    var con: HTMLElement, el: HTMLElement
    // high sample will more accurate?
    var sample = 100

    function initElements() {
        con = document.createElement('div')
        con.style.width = `0`
        con.style.height = `0`
        con.style.visibility = 'hidden'
        con.style.overflow = 'hidden'

        el = document.createElement('div')

        con.appendChild(el)
    }

    function pxPerUnit(unit): number {
        if (!con) initElements()
        el.style.width = sample + unit
        document.body.appendChild(con)
        var dimension = el.getBoundingClientRect()
        con.parentNode.removeChild(con)
        return dimension.width / sample
    }

    function toPx(length: string): number {
        var unitRe = /^\s*([+-]?[\d\.]*)\s*(.*)\s*$/i
        var match = unitRe.exec(length)
        while (1) {
            if (!match || match.length < 3) break
            var val = Number(match[1])
            if (isNaN(val)) break
            var unit = match[2]
            if (!unit) break
            var valid = true
            val = val || 1
            break
        }
        if (!valid) throw new TypeError('Error parsing length')
        return unit == 'px' ? val : pxPerUnit(unit) * val
    }

    return toPx
})()