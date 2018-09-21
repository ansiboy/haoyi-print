import { ControlProps, PageViewContext, PageView, Control, ControlPropEditors, PageViewProps } from 'jueying';
import * as React from 'react';
import 'jueying'
import { ControlSize } from './controls/controlSize';
import { controlSize } from './baseControl';

jueying.PageView.prototype.render = function () {
    let self = this as PageView;
    let props = self.props
    let elementProps = { style: {} } as ControlProps<PageView>
    if (props.width) {
        elementProps.style.width = `${props.width}${props.unit}`
        elementProps.style.fontFamily = props.fontFamily
    }
    return this.Element(elementProps, <>
        <PageViewContext.Provider value={{ pageView: self }}>
            {this.props.children}
        </PageViewContext.Provider>
    </>)
}

const fontFamilies = [
    'Microsoft YaHei', 'Hiragino Sans GB', 'FangSong_GB2312', 'Microsoft Sans Serif',
    'Helvetica, Arial', 'Lucida Grande', 'sans-serif'
]

jueying.PageView.defaultProps = { unit: 'mm', fontFamily: 'Microsoft YaHei' }

// jueying.PageViewEditor.prototype.render = function () {
//     let self = this as PageViewEditor
//     let { name, style, fontFamily } = self.state
//     style = style || {}

//     let { width } = style

//     return self.Element(<>
//         <div className="form-group">
//             <label>名称</label>
//             <div className="control">
//                 <input className="form-control" value={name || ''}
//                     onChange={(e) => {
//                         name = (e.target as HTMLInputElement).value;
//                         self.setState({ name });
//                     }} />
//             </div>
//         </div>
//         <div className="form-group">
//             <label>宽</label>
//             <div className="control">
//                 <ControlSize size={width}
//                     onChange={width => {
//                         style.width = width
//                         self.setState({ style })
//                     }} />
//             </div>
//         </div>
//         <div className="form-group">
//             <label>字体</label>
//             <div className="control">
//                 <select className="form-control" value={fontFamily || ''}
//                     onChange={e => {
//                         fontFamily = e.target.value
//                         self.setState({ fontFamily })
//                     }}>
//                     {fontFamilies.map(o =>
//                         <option key={o} value={o}>{o}</option>
//                     )}
//                 </select>
//             </div>
//         </div>
//     </>)
// }

// jueying.ControlPlaceholder.prototype.render = function () {
//     let self = this as jueying.ControlPlaceholder
//     let { emptyText, htmlTag } = self.props;
//     let emptyElement = <div className="empty">{emptyText || ''}</div>;
//     htmlTag = htmlTag || 'div';
//     let controls = this.props.children as JSX.Element[] || [];
//     return <PageViewContext.Consumer>
//         {c => {
//             this.pageView = c.pageView;
//             return this.Element(htmlTag, <React.Fragment>
//                 {controls.length == 0 ? emptyElement : controls}
//             </React.Fragment>);
//         }}
//     </PageViewContext.Consumer>
// }



// jueying.ControlPlaceholderEditor.prototype.render = function () {
//     let self = this as jueying.ControlPlaceholderEditor
//     let { name, showField, field } = self.state;
//     return this.Element(<>
//         <div className="form-group">
//             <label>名称</label>
//             <div className="control">
//                 <input className="form-control" value={name || ''}
//                     onChange={(e) => {
//                         name = e.target.value;
//                         this.setState({ name });
//                     }} />
//             </div>
//         </div>
//         {showField ?
//             <div className="form-group">
//                 <label>字段</label>
//                 <div className="control">
//                     <input className="form-control" value={field || ''}
//                         onChange={(e) => {
//                             field = e.target.value;
//                             this.setState({ field });
//                         }} />
//                 </div>
//             </div> : null
//         }
//     </>)
// }

