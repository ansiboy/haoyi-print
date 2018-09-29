
declare function h(type, props, ...children);
interface Window {
    webkitURL: string
}

declare namespace JQueryUI {
    interface DroppableOptions {
        multiple: boolean,
    }
}

interface DD {
    available: any[]
    deltaX: number
    deltaY: number
    offsetX:number
    offsetY:number
}

interface JQuery<TElement = HTMLElement> extends Iterable<TElement> {
    // drag(handler?: JQuery.EventHandler<TElement> | JQuery.EventHandlerBase<any, JQuery.Event<TElement>> | false): this

    drag(func: (ev?: JQuery.Event<TElement>, dd?: DD) => void, options?: object): this;
    drag(event: string, func: (ev?: JQuery.Event<TElement>, dd?: DD) => void, options?: object): this;
    drag(arg1: string | Function, func?: (ev?: JQuery.Event<TElement>, dd?: DD, options?: object) => void): this;
}
