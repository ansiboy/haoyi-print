import http = require('http')
import errors = require('./errors');
import url = require('url');
import querystring = require('querystring');

export let webServer = http.createServer(async (req, res) => {

    setHeaders(res)
    if (req.method == 'OPTIONS') {
        res.end()
        return
    }
    try {

        let requestUrl = req.url || ''
        let urlInfo = url.parse(requestUrl);
        let path = urlInfo.pathname || '';
        let arr = path.split('/').filter(o => o)
        let [controllerName, actionName] = arr

        if (!controllerName)
            throw errors.canntGetControlName(requestUrl)

        if (!actionName)
            throw errors.canntGetActionName(requestUrl)

        await executeAction(controllerName, actionName, req, res)
    }
    catch (err) {
        outputError(err, res)
    }
});

function setHeaders(res: http.ServerResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json;charset=utf-8');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', `POST, GET, OPTIONS, PUT, DELETE`);
}

webServer.on('error', (err) => {
    console.log(err)
})

async function executeAction(controllerName: string, actionName: string, req: http.IncomingMessage, res: http.ServerResponse) {

    let controllerPath = `./modules/${controllerName}`

    let controller = require(controllerPath);
    if (controller == null) {
        throw errors.controllerNotExist(controllerPath);
    }

    let action = controller[actionName] as Function; controller
    if (action == null) {
        console.log(`Action '${actionName}' is not exists in '${controllerName}'`);
        throw errors.actionNotExists(actionName, controllerName);
    }

    let dataPromise: Promise<any>;
    if (req.method == 'GET') {
        let queryData = getQueryObject(req);
        dataPromise = Promise.resolve(queryData);
    }
    else {
        dataPromise = getPostObject(req);
    }

    let data = await dataPromise
    let result = action.apply(controller, [data])
    if (result instanceof Promise) {
        result.then(r => outputResult(r, res))
            .catch(e => outputError(e, res))

        return
    }
    outputResult(result, res)
}

/**
 * 
 * @param request 获取 QueryString 里的对象
 */
function getQueryObject(request: http.IncomingMessage): object {
    let contentType = request.headers['content-type'] as string;
    let obj = {};
    if (contentType != null && contentType.indexOf('application/json') >= 0) {
        let arr = (request.url || '').split('?');
        let str = arr[1]
        if (str != null) {
            str = decodeURI(str);
            obj = JSON.parse(str);  //TODO：异常处理
        }
    }
    else {
        let urlInfo = url.parse(request.url || '');
        let { search } = urlInfo;
        if (search) {
            obj = querystring.parse(search.substr(1));
        }

        // obj = request.query;
    }

    return obj;
}


function getPostObject(request: http.IncomingMessage): Promise<any> {
    let length = request.headers['content-length'] || 0;
    let contentType = request.headers['content-type'] as string;
    if (length <= 0)
        return Promise.resolve({});

    return new Promise((reslove, reject) => {
        request.on('data', (data: { toString: () => string }) => {
            let text = data.toString();
            try {
                let obj;
                if (contentType.indexOf('application/json') >= 0) {
                    obj = JSON.parse(text)
                }
                else {
                    obj = querystring.parse(text);
                }

                reslove(obj);
            }
            catch (exc) {
                let err = errors.postDataNotJSON(text);
                console.assert(err != null);
                reject(err);
            }
        });
    });
}


export const contentTypes = {
    application_json: 'application/json',
    text_plain: 'text/plain',
}

function outputResult(result: object | null, res: http.ServerResponse) {
    result = result === undefined ? null : result
    let contentResult: ContentResult
    if (result instanceof ContentResult) {
        contentResult = result
    }
    else {
        contentResult = typeof result == 'string' ?
            new ContentResult(result, contentTypes.text_plain, 200) :
            new ContentResult(JSON.stringify(result), contentTypes.application_json, 200)
    }

    res.setHeader("content-type", contentResult.contentType || contentTypes.text_plain);
    res.statusCode = contentResult.statusCode || 200;
    res.end(contentResult.data);
}

function outputError(err: Error, res: http.ServerResponse) {
    console.assert(err != null, 'error is null');

    const defaultErrorStatusCode = 600;

    res.setHeader("content-type", contentTypes.application_json);
    res.statusCode = defaultErrorStatusCode;
    res.statusMessage = err.name;      // statusMessage 不能为中文，否则会出现 invalid chartset 的异常

    if (/^\d\d\d\s/.test(err.name)) {
        res.statusCode = Number.parseInt(err.name.substr(0, 3));
        err.name = err.name.substr(4);
    }

    let outputObject = { message: err.message, name: err.name, stack: err.stack };
    let str = JSON.stringify(outputObject);
    res.write(str);
    res.end();
}

// type ActionResult = { data: any, contentType?: string, statusCode?: number }
export class ContentResult {
    data: string
    statusCode: number
    contentType: string
    constructor(data: string, contentType: string, statusCode?: number) {
        this.data = data
        this.contentType = contentType
        this.statusCode = statusCode == null ? 200 : statusCode
    }
}