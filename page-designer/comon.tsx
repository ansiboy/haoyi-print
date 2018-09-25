namespace jueying {

    export let constants = {
        componentsDir: 'components',
        connectorElementClassName: 'component-container',
        componentTypeName: 'data-component-name'
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
        controlSelected: `control-selected `,
        emptyTemplates: `empty-templates`,
        loadingTemplates: `loading-templates`,
        templateSelected: `template-selected`,
        templateDialog: `template-dialog`,
    }

    let element = document.createElement('style');
    element.type = 'text/css';
    element.innerHTML = `
        .${classNames.controlSelected} {
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