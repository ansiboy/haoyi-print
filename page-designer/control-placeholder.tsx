/// <reference path="page-control.tsx"/>
/// <reference path="page-designer.tsx"/>
/// <reference path="control-factory.tsx"/>
/// <reference path="editor-factory.tsx"/>

namespace jueying {

    const defaultEmptyText = '可以从工具栏拖拉控件到这里'

    export interface ControlPlaceholderState {
        controls: ElementData[]
    }
    export interface ControlPlaceholderProps extends ControlProps<any> {
        style?: React.CSSProperties,
        emptyText?: string,
        htmlTag?: string,
        layout?: 'flowing' | 'absolute',
    }

    export class ControlPlaceholder<P extends ControlPlaceholderProps, S extends ControlPlaceholderState> extends Control<P, S> {

        static defaultProps: ControlPlaceholderProps = {
            className: `place-holder ${Control.connectorElementClassName}`,
            layout: 'flowing'
        };

        constructor(props) {
            super(props)

            this.state = { controls: [] } as ControlPlaceholderState as any;
        }

        static sortableElement(element: HTMLElement, designer: PageDesigner) {

            $(element).sortable({
                axis: "y",
                connectWith: `.${Control.connectorElementClassName}`,
                receive(event, ui) {
                },
                update: (event, ui) => {
                    let element = event.target as HTMLElement;
                    if (ui.item && !ui.item[0].id) {    // 添加操作
                        console.assert(ui.item.length == 1);
                        let componentName = ui.item.attr(Control.controlTypeName);
                        console.assert(componentName);

                        let ctrl: ElementData = { type: componentName, props: { id: guid() } };
                        ui.item[0].setAttribute('id', ctrl.props.id);
                        //==================================================
                        // 将所有 id 子元素找出来，用于排序
                        let childIds = this.childrenIds(element);
                        //==================================================
                        // 需要 setTimout 才能删除
                        setTimeout(() => {
                            ui.item.remove();
                        })
                        //==================================================
                        designer.appendControl(element.id, ctrl, childIds);
                    }
                    else if (ui.item && ui.item[0].id) {    // 更新操作
                        console.assert(ui.item.length == 1);
                        let childIds = this.childrenIds(element);
                        if (childIds.indexOf(ui.item[0].id) >= 0) {
                            //==================================================
                            // 需要 setTimout
                            setTimeout(() => {
                                designer.moveControl(ui.item[0].id, element.id, childIds);
                            });
                            //==================================================
                        }
                    }
                },
                stop() {
                    // ===============================================
                    // jquery ui 取消操作，让 react 更新 dom
                    // https://stackoverflow.com/questions/29725136/jquery-ui-sortable-with-react-js-buggy
                    $(element).sortable('cancel');
                    // ===============================================
                }

            })
        }

        private draggableElement(element: HTMLElement) {

            let x: number, y: number;
            let deltaX: number, deltaY: number;
            let elementStartPositions: { left: number, top: number, id: string }[];
            element.draggable = true
            element.ondragstart = (ev) => {
                x = ev.layerX
                y = ev.layerY

                let containerSelectedElements = this.designer.selectedControlIds.map(id => {
                    if (id == this.element.id)
                        return null

                    if ($(`#${id}`).parents(`#${this.element.id}`).length == 0) {
                        return null
                    }

                    return document.getElementById(id)

                }).filter(o => o)

                elementStartPositions = containerSelectedElements.map(o => {
                    let pos = $(o).position()
                    return { id: o.id, left: pos.left, top: pos.top }
                })
            }
            element.ondrag = (ev) => {
                deltaX = ev.layerX - x
                deltaY = ev.layerY - y

                elementStartPositions.forEach(o => {
                    let item = document.getElementById(o.id)
                    if (item.id == element.id) {
                        item.style.visibility = "hidden"
                        return
                    }

                    let left = o.left + deltaX
                    let top = o.top + deltaY
                    console.log(`left:${left} top:${top}`)
                    item.style.left = `${left}px`
                    item.style.top = `${top}px`
                })
            }
            element.ondragend = (ev) => {
                var positions = elementStartPositions.map(o => ({ controlId: o.id, left: o.left + deltaX, top: o.top + deltaY }))
                positions.forEach(o => {
                    console.log(o)
                    let item = document.getElementById(o.controlId)
                    if (item.id == element.id) {
                        item.style.removeProperty('visibility')
                        return
                    }
                    item.style.left = `${o.left}px`
                    item.style.top = `${o.top}px`
                })
                this.designer.setControlsPosition(positions)
                x = y = deltaX = deltaY = null
            }


        }


        /**
         * 启用拖放操作，以便通过拖放图标添加控件
         */
        private enableDroppable() {
            let element = this.element
            console.assert(element != null)
            element.addEventListener('dragover', function (event) {
                event.preventDefault()
                event.stopPropagation()

                let componentName = event.dataTransfer.getData(Control.controlTypeName)
                if (componentName)
                    event.dataTransfer.dropEffect = "copy"
                else
                    event.dataTransfer.dropEffect = "move"

                console.log(`dragover: left:${event.layerX} top:${event.layerX}`)
            })
            element.ondrop = (event) => {
                event.preventDefault()
                event.stopPropagation()

                let componentName = event.dataTransfer.getData(Control.controlTypeName)
                if (!componentName) {
                    return
                }

                let left = event.layerX;
                let top = event.layerY;
                let ctrl: ElementData = {
                    type: componentName,
                    props: {
                        id: guid(),
                        style: {
                            position: 'absolute',
                            left,
                            top,
                        }
                    }
                };
                this.designer.appendControl(element.id, ctrl);
            }

        }
        private static childrenIds(element: HTMLElement) {
            let childIds = new Array<string>();
            for (let i = 0; i < element.children.length; i++) {
                if (!element.children.item(i).id)
                    continue;

                childIds.push(element.children.item(i).id);
            }
            return childIds;
        }

        componentDidMount() {
            if (this.designer) {
                if (this.props.layout == 'flowing') {
                    ControlPlaceholder.sortableElement(this.element, this.designer);
                }
                else {
                    this.enableDroppable()
                    this.designer.selectedControlIds
                        .map(id => document.getElementById(id))
                        .filter(o => o)
                        .forEach(element => {
                            if ($(element).parents(`#${this.element.id}`).length) {
                                console.assert(element.id, 'control id is null or empty.');
                                this.draggableElement(element)
                            }
                        })
                }
            }
        }
        render(h?: any) {
            let { emptyText, htmlTag } = this.props;

            let emptyElement = <div className="empty">{emptyText || defaultEmptyText}</div>;
            htmlTag = htmlTag || 'div';
            let controls = this.props.children as JSX.Element[] || [];
            return this.Element(htmlTag,
                <React.Fragment>
                    {controls.length == 0 ? emptyElement : controls}
                </React.Fragment>
            );
        }
    }
    ControlFactory.register(ControlPlaceholder);


}