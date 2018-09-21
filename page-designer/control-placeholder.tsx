/// <reference path="page-control.tsx"/>
/// <reference path="page-designer.tsx"/>
/// <reference path="control-factory.tsx"/>
/// <reference path="editor-factory.tsx"/>

namespace jueying {
    export interface ControlPlaceholderState {
        controls: ElementData[]
    }
    export interface ControlPlaceholderProps extends ControlProps<ControlPlaceholder> {
        style?: React.CSSProperties,
        emptyText?: string,
        htmlTag?: string,
    }

    export class ControlPlaceholder extends Control<ControlPlaceholderProps, ControlPlaceholderState> {
        private controls: (Control<any, any> & { id: string, name: string })[];

        static defaultProps = {
            className: `place-holder ${Control.connectorElementClassName}`,
            layout: 'flowing'
        };
        pageView: PageView;

        constructor(props) {
            super(props)

            this.state = { controls: [] };
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
                        let componentName = ui.item.attr('data-control-name');
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

            (element as any).is_draggable = true
            $(element).draggable({
                start: (event, ui) => {
                    x = ui.position.left
                    y = ui.position.top

                    let containerSelectedElements = this.designer.selectedControlIds
                        .map(id => {
                            if (id == this.element.id)
                                return null

                            if ($(`#${id}`).parents(`#${this.element.id}`).length == 0) {
                                return null
                            }

                            return document.getElementById(id)
                        })
                        .filter(o => o)

                    elementStartPositions = containerSelectedElements.map(o => {
                        let pos = $(o).position()
                        return { id: o.id, left: pos.left, top: pos.top }
                    })
                },
                drag: (event, ui) => {
                    deltaX = ui.position.left - x
                    deltaY = ui.position.top - y

                    elementStartPositions.forEach(o => {
                        let left = o.left + deltaX
                        let top = o.top + deltaY
                        let element = document.getElementById(o.id)
                        element.style.left = `${left}px`
                        element.style.top = `${top}px`
                    })
                },
                stop: () => {
                    var positions = elementStartPositions.map(o => ({ controlId: o.id, left: o.left + deltaX, top: o.top + deltaY }))
                    positions.forEach(o => {
                        console.log(o)
                        let element = document.getElementById(o.controlId)
                        element.style.left = `${o.left}px`
                        element.style.top = `${o.top}px`
                    })
                    this.designer.setControlsPosition(positions)
                    x = y = deltaX = deltaY = null
                }
            });
        }

        private enableDraggable() {
            console.assert(this.element != null)

            let capture = false
            let x: number, y: number;
            let deltaX: number;
            let deltaY: number;

            this.element.addEventListener('mousedown', (event) => {
                if (event.target == this.element)
                    return

                capture = true
            })
            this.element.addEventListener('mousemove', (event) => {
                if (!capture || this.element == event.target) {
                    return
                }
                if (x != null && y != null) {
                    deltaX = event.screenX - x
                    deltaY = event.screenY - y

                    let elements = this.designer.selectedControlIds.map(id => document.getElementById(id))
                    elements.forEach(o => {
                        let pos = $(o).position()
                        let x = pos.left + deltaX
                        let y = pos.top + deltaY

                        o.style.left = `${x}px`
                        o.style.top = `${y}px`
                        console.assert(o.id)
                    })
                    // this.designer.setControlPosition()
                }

                x = event.screenX
                y = event.screenY
            })
            this.element.addEventListener('mouseup', () => {
                capture = false
                x = null
                y = null
            })

        }

        /**
         * 启用接收拖放操作，以便通过拖放图标添加控件
         */
        private enableDroppable() {
            let element = this.element
            console.assert(element != null)
            $(element).droppable({
                multiple: true,
                activate: function (event, ui) {
                    ui.helper.css({
                        'position': 'absolute',
                        'z-index': 1000,
                    });
                },
                drop: (event, ui) => {
                    let element = event.target as HTMLElement;
                    console.assert(ui.draggable != null);
                    if (ui.draggable.attr(Control.controlTypeName)) {    // 添加操作 //&& !ui.draggable[0].id
                        console.assert(ui.draggable.length == 1);
                        let componentName = ui.draggable.attr('data-control-name');
                        console.assert(componentName);

                        let baseRect = this.element.getClientRects()[0]
                        let iconRect = ui.helper[0].getClientRects()[0];
                        if (!iconRect)
                            return;

                        let left = iconRect.left - baseRect.left;
                        let top = iconRect.top - baseRect.top;
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
                        // $(`#${ctrl.props.id}`).draggable();
                        this.draggableElement(document.getElementById(ctrl.props.id))
                    }
                    // else {
                    //     let ctrlId = ui.draggable.attr('id');
                    //     let pos = ui.draggable.position();
                    //     this.designer.setControlPosition(ctrlId, pos.left, pos.top)
                    //     this.designer.selectSingleControlById(ctrlId);
                    // }
                }
            })
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
                if (this.pageView.layout == 'flowing') {
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
                    // this.designer.controlSelected.add((ctrls) => {
                    //     ctrls.forEach(ctrl => {
                    //         if ($(ctrl.element).parents(`#${this.element.id}`).length) {
                    //             console.assert(ctrl.id, 'control id is null or empty.');
                    //             this.draggableElement(ctrl.element)
                    //         }
                    //     })
                    // })
                }
            }
        }
        render(h?: any) {
            let { emptyText, htmlTag } = this.props;
            let emptyElement = <div className="empty">{emptyText || ''}</div>;
            htmlTag = htmlTag || 'div';
            let controls = this.props.children as JSX.Element[] || [];
            let self = this;

            return <PageViewContext.Consumer>
                {c => {
                    this.pageView = c.pageView;
                    return this.Element(htmlTag,
                        <React.Fragment>
                            {controls.length == 0 ? emptyElement : controls}
                        </React.Fragment>
                    );
                }}
            </PageViewContext.Consumer>
        }
    }
    ControlFactory.register(ControlPlaceholder);

    // export interface ControlPlaceholderEditorState extends Partial<ControlPlaceholderProps> {

    // }
    // export class ControlPlaceholderEditor extends ControlEditor<EditorProps, ControlPlaceholderEditorState> {
    //     render() {
    //         let { name } = this.state;
    //         return this.Element(<React.Fragment>
    //             <div className="form-group">
    //                 <label>名称</label>
    //                 <div className="control">
    //                     <input className="form-control" value={name || ''}
    //                         onChange={(e) => {
    //                             name = (e.target as HTMLInputElement).value;
    //                             this.setState({ name });
    //                         }} />
    //                 </div>
    //             </div>
    //         </React.Fragment>)
    //     }
    // }

    // ControlEditorFactory.register('ControlPlaceholder', ControlPlaceholderEditor);
}