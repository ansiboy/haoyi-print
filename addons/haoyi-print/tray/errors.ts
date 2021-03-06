interface MyError extends Error {
    arguments: any
}

//export class Errors {
export let names = {
    ActionNotExists: '700 ActionNotExists',
    AdminNotExists: '701 AdminNotExists',
    ApplicationExists: '702 ApplicationExists',
    ApplicationIdRequired: '703 ApplicationIdRequired',
    ApplicationTokenRequired: '704 ApplicationTokenRequired',
    ArgumentNull: '705 ArgumentNull',
    CanntGetHeaderFromRequest: '706 CanntGetHeaderFromRequest',
    ControllerNotExist: '707 ControllerNotExist',
    DeleteResultZero: '708 DeleteResultZero',
    FieldNull: '709 FieldNull',
    InvalidToken: '710 InvalidToken',
    NotAllowRegister: '711 NotAllowRegister',
    NotImplement: '712 NotImplement',
    mobileIsBind: '713 MobileIsBind',
    ObjectNotExistWithId: '714 ObjectNotExistWithId',
    PasswordIncorect: '715 PasswordIncorect',
    PostIsRequired: '716 PostIsRequired',
    Success: '200 Success',
    UserExists: '717 UserExists',
    UserIdRequired: '718 UserIdRequired',
    userNotExists: '719 userNotExists',
    UpdateResultZero: '720 UpdateResultZero',
    VerifyCodeIncorrect: '721 VerifyCodeIncorrect',
    VerifyCodeNotMatchMobile: '722 VerifyCodeNotMatchMobile',
    CanntGetRedirectUrl: '723 CanntGetRedirectUrl',
    // tokenNotExists: '724 tokenNotExists',
    userTokenNotExists: '724 userTokenNotExists',
    appTokenNotExists: '725 appTokenNotExists',
}

export function fieldNull(fieldName: string, objectName: string): Error {
    let msg = `The '${fieldName}' field of '${objectName}' object cannt be null.`;
    let error = new Error(msg);
    error.name = names.FieldNull;
    return error;
}

export function argumentNull(argumentName: string): Error {
    let msg = `Argument '${argumentName}' cannt be null`;
    let error = new Error(msg);
    error.name = names.ArgumentNull;
    return error;
}

export function passwordIncorect(username: string): Error {
    let msg = `Password incorect.`;
    let error = new Error(msg);
    error.name = names.PasswordIncorect;
    return error;
}

export function usernameExists(username: string): Error {
    let msg = `用户名 '${username}' 已被注册`;
    let error = new Error(msg);
    error.name = names.UserExists;
    (<any>error).arguments = { username };
    return error;
}

export function mobileExists(mobile: string): Error {
    let msg = `手机号 '${mobile}' 已被注册`;
    let error = new Error(msg);
    error.name = 'MobileExists';
    (<any>error).arguments = { mobile };
    return error;
}

export function success(): Error {
    let msg = `Success`;
    let error = new Error(msg);
    error.name = names.Success;
    error.stack = undefined;
    return error;
}

export function notAllowRegister(): Error {
    let msg = 'System is config to not allow register.'
    let error = new Error(msg);
    error.name = names.NotAllowRegister;
    return error;
}

export function notImplement(): Error {
    let msg = 'Not implement.';
    let error = new Error(msg);
    error.name = names.NotImplement;
    return error;
}

export function userNotExists(username: string): Error {
    let msg = `User '${username}' is not exists.`
    let error = new Error(msg) as MyError;
    error.name = names.userNotExists;
    error.arguments = { username };
    return error;
}

export function adminNotExists(username: string): Error {
    let msg = `Admin '${username}' is not exists.`
    let error = new Error(msg) as MyError;
    error.name = names.AdminNotExists;
    error.arguments = { username };
    return error;
}

export function invalidToken(tokenValue: string): Error {
    let msg = `Token '${tokenValue}' is not a valid token.`;
    let error = new Error(msg) as MyError;
    error.name = names.InvalidToken;
    error.arguments = { token: tokenValue };
    return error;
}

export function applicationExists(name: string): Error {
    let msg = `Application with name '${name}' is exists.`;
    let error = new Error(msg) as MyError;
    error.name = names.ApplicationExists;
    error.arguments = { name };
    return error;
}

export function applicationNotExists(name: string): Error {
    let msg = `Application with name '${name}' is not exists.`;
    let error = new Error(msg) as MyError;
    error.name = names.ApplicationExists;
    error.arguments = { name };
    return error;
}

export function deleteResultZero(): Error {
    let msg = 'Deleted count is zero, maybe the object is not exists.'
    let error = new Error(msg);
    error.name = names.DeleteResultZero;
    return error;
}

export function updateResultZero(): Error {
    let msg = 'Updated count is zero, maybe the object is not exists.'
    let error = new Error(msg);
    error.name = names.UpdateResultZero;
    return error;
}

export function postIsRequired(): Error {
    let msg = 'Post request is required.';
    let error = new Error(msg);
    error.name = names.PostIsRequired;
    return error;
}

export function canntGetQueryStringFromRequest(itemName: string): Error {
    let msg = `Can not get query string '${itemName}' from the request url.`;
    let error = new Error(msg);
    error.name = names.CanntGetHeaderFromRequest;
    return error;
}

export function canntGetHeader(headerName: string): Error {
    let msg = `Cannt get header '${headerName}' from headers.`;
    let error = new Error(msg);
    error.name = 'CanntGetHeader';
    return error;
}

export function controllerNotExist(path: string): Error {
    let msg = `Controller is not exists in path '${path}'.`;
    let error = new Error(msg);
    error.name = names.ControllerNotExist;
    return error;
}

export function actionNotExists(action: string, controller: string): Error {
    let msg = `Action '${action}' is not exists in controller '${controller}'`;
    let error = new Error(msg);
    error.name = names.ActionNotExists;
    return error;
}

export function canntGetControlName(url: string) {
    let msg = `Cannt get controll name from url:${url}`;
    let error = new Error(msg);
    error.name = canntGetControlName.name
    return error;
}

export function canntGetActionName(url: string) {
    let msg = `Cannt get action name from url:${url}`;
    let error = new Error(msg);
    error.name = canntGetActionName.name
    return error;
}

export function objectNotExistWithId(objectId: string, objectName: string): Error {
    let msg = `${objectName} not exists with id '${objectId}'`;
    let error = new Error(msg);
    error.name = names.ObjectNotExistWithId;
    return error;
}

export function applicationIdRequired(): Error {
    let msg = `Application id is required.`;
    let err = new Error(msg);
    err.name = names.ApplicationIdRequired;

    return err;
}

export function userIdRequired(): Error {
    let msg = `User id is required.`;
    let err = new Error(msg);
    err.name = names.UserIdRequired;

    return err;
}

export function applicationTokenRequired(): Error {
    let msg = `Application token is required.`;
    let err = new Error(msg);
    err.name = names.ApplicationTokenRequired;

    return err;
}

// export function tokenNotExists(tokenId: string) {
//     let msg = `Token not exists with id '${tokenId}'`;
//     let error = new Error(msg);
//     error.name = names.tokenNotExists;
//     return error;
// }

//==================================================================
// 验证码

export function verifyCodeIncorrect(verifyCode: string): Error {
    let msg = `验证码不正确`
    let err = new Error(msg) as MyError;
    err.name = names.VerifyCodeIncorrect;
    err.arguments = { verifyCode };
    return err;
}

export function verifyCodeNotMatchMobile(mobile: string): Error {
    let msg = `验证码与手机号码'${mobile}'不匹配`
    let err = new Error(msg) as MyError;
    err.name = names.VerifyCodeNotMatchMobile;
    err.arguments = { mobile };
    return err;
}

//==================================================================

export function mobileIsBind(mobile: string): Error {
    let msg = `手机号码'${mobile}'已被绑定。`;
    let err = new Error(msg) as MyError;
    err.name = names.mobileIsBind;
    return err;
}

export function postDataNotJSON(data: string): Error {
    let msg = `提交的数据不是 JSON 格式。提交数据为：${data}`;
    let err = new Error(msg) as MyError;
    err.name = 'postDataNotJSON';
    return err;
}

export function invalidObjectId(objectId: string) {
    let msg = `非法的 ObjectId:'${objectId}'`;
    let err = new Error(msg) as MyError;
    err.name = 'invalidObjectId';
    return err;
}

export function canntGetRedirectUrl(rootDir: string) {
    let msg = `Can not find redirect url for '${rootDir}'`;
    let err = new Error(msg) as MyError;
    err.name = names.CanntGetRedirectUrl;
    return err;
}

export function appTokenNotExists(token: string) {
    let msg = `Application token '${token}' is not exists.`;
    let err = new Error(msg);
    err.name = names.appTokenNotExists;
    return err;
}

export function userTokenNotExists(token: string) {
    let msg = `User token '${token}' is not exists.`;
    let err = new Error(msg);
    err.name = names.userTokenNotExists;
    return err;
}