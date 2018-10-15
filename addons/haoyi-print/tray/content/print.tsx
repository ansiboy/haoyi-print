import "../../design/components/image"
import "../../design/components/label"
import "../../design/components/list"
import "../../design/components/page-view"
import "../../design/components/square-code"

import { Service } from "../../design/service";
import { createTemplateElement } from "../../design/print";
import ReactDOM = require("react-dom");


let templateName = getQueryVariable('templateName')
console.assert(templateName)

let printData = getQueryVariable('printData')
printData = printData || '{}'

let service = new Service()
service.templateGet(templateName).then(async doc => {
    console.assert(doc)

    let data = JSON.parse(printData)
    let templateElement = await createTemplateElement(templateName, data)
    ReactDOM.render(templateElement, document.getElementById('container'))
    
})

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return null
}