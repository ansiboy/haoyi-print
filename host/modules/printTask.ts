// import { argumentNull } from "../errors";

// export interface PrintTask {
//     id: string,
//     templateName: string,
//     templateData: object,
// }
// let printTasks: PrintTask[] = []

// /** 创建打印任务 */
// export function create({ templateName, templateData }: { templateName: string, templateData: object }) {
//     if (!templateName) throw argumentNull('templateName')
//     if (!templateData) throw argumentNull('templateData')

//     let task: PrintTask = {
//         id: guid(),
//         templateName,
//         templateData,
//     }

//     printTasks.push(task)
// }

// /** 获取第一个打印任务 */
// export function first() {
//     return printTasks[0]
// }

// export function remove({ id }: { id: string }) {
//     if (!id) throw argumentNull('id')
//     printTasks = printTasks.filter(o => o.id != id)
// }

// function guid() {
//     function s4() {
//         return Math.floor((1 + Math.random()) * 0x10000)
//             .toString(16)
//             .substring(1);
//     }
//     return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
//         s4() + '-' + s4() + s4() + s4();
// }