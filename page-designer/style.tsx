namespace jueying {
    export let classNames = {
        componentSelected: `component-selected`,
        emptyTemplates: `empty-templates`,
        loadingTemplates: `loading-templates`,
        templateSelected: `template-selected`,
        templateDialog: `template-dialog`,
        emptyDocument: `empty-document`,

        component: 'component',
        componentWrapper: 'component-wrapper'
    }

    let templateDialog = {
        nameHeight: 40,
        fontSize: 22
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
        .${classNames.templateDialog} .name {
            margin-top: -${templateDialog.nameHeight}px;
            height: ${templateDialog.nameHeight}px;
            font-size: ${templateDialog.fontSize}px;
            text-align: center;
            padding-top: 6px;
            background-color: black;
            opacity: 0.5;
        }
        .${classNames.templateDialog} .name span {
            color: white;
        }
        .${classNames.emptyDocument} {
            text-align: center;
            padding: 100px 0;
        }
        ul.nav-tabs li i {
            position: relative;
            top: 4px;
            right: -6px;
        }
        .validationMessage {
            position: absolute;
            margin-top: -60px;
            background-color: red;
            color: white;
            padding: 4px 10px;
        }
    `;
    document.head.appendChild(element);

    export function appendClassName(sourceClassName: string, addonClassName) {
        sourceClassName = sourceClassName || ''
        console.assert(addonClassName)

        if (sourceClassName.indexOf(addonClassName) >= 0)
            return sourceClassName

        return `${sourceClassName} ${addonClassName}`
    }

    export function removeClassName(sourceClassName: string, targetClassName) {
        sourceClassName = sourceClassName || ''
        sourceClassName = sourceClassName.replace(new RegExp(targetClassName, 'g'), '')
        sourceClassName = sourceClassName.trim()
        return sourceClassName
    }

}