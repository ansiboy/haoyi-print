namespace jueying {

    export let constants = {
        componentsDir: 'components',
        connectorElementClassName: 'component-container',
        componentTypeName: 'data-component-name',
        componentData: 'component-data'
    }

    export let propsGroups = {
        property: 'property',
        style: 'style'
    }

    export let strings = {
        property: '属性',
        style: '样式',
        field: '字段',
        fontSize: '字体大小',
        height: '高',
        left: '左边',
        name: '名称',
        top: '顶部',
        text: '文本',
        width: '宽'
    }

    export function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    export let classNames = {
        componentSelected: `control-selected `,
        emptyTemplates: `empty-templates`,
        loadingTemplates: `loading-templates`,
        templateSelected: `template-selected`,
        templateDialog: `template-dialog`,
        component: 'component'
    }

    let element = document.createElement('style');
    element.type = 'text/css';
    element.innerHTML = `
        .${classNames.componentSelected} {
            border: solid 1px #337ab7!important;
        }
        .${classNames.emptyTemplates} {
            padding:50px 0;
            text-align: center;
        }
        .${classNames.loadingTemplates} {
            padding:50px 0;
            text-align: center;
        }
        .${classNames.templateSelected} .page-view {
            border: solid 1px #337ab7!important;
        }
        .${classNames.templateDialog} .name span {
            color: white;
        }
        .validationMessage {
            position: absolute;
            margin-top: -60px;
            background-color: red;
            color: white;
            padding: 4px 10px;
        }
    `;
    /*
        .${classNames.templateDialog} .name {
            margin-top: -${templateDialog.nameHeight}px;
            height: ${templateDialog.nameHeight}px;
            font-size: ${templateDialog.fontSize}px;
            text-align: center;
            padding-top: 6px;
            background-color: black;
            opacity: 0.5;
        }
    */
    document.head.appendChild(element);
}