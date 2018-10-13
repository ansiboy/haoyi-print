
// namespace jueying.forms {
//     export class PageDocumentFile {
//         private storage: DocumentStorage;
//         private _document: PageDocument;
//         private originalPageData: PageDocument;
//         private _fileName: string;

//         constructor(fileName: string, storage: DocumentStorage, document: PageDocument) {
//             this.storage = storage;
//             this._document = document;
//             this.originalPageData = JSON.parse(JSON.stringify(document));
//             this._fileName = fileName;
//         }

//         save() {
//             this.originalPageData = JSON.parse(JSON.stringify(this._document));
//             return this.storage.save(this._fileName, this._document);
//         }

//         get notSaved() {
//             let equals = isEquals(this.originalPageData, this._document);
//             return !equals;
//         }

//         get fileName() {
//             return this._fileName;
//         }

//         get document() {
//             return this._document;
//         }
//         set document(value) {
//             this._document = value
//         }

//         static async load(storage: DocumentStorage, fileName: string) {
//             // let storage = new LocalDocumentStorage()
//             let data = await storage.load(fileName);
//             if (data == null) {
//                 throw Errors.fileNotExists(fileName);
//             }

//             return new PageDocumentFile(fileName, storage, data);
//         }

//         static new(storage: DocumentStorage, fileName: string, init: PageDocument) {
//             // let storage = new LocalDocumentStorage()
//             return new PageDocumentFile(fileName, storage, init);
//         }

//     }

//     function isEquals(obj1: object, obj2: object) {

//         if ((obj1 == null && obj2 != null) || (obj1 != null && obj2 == null))
//             return false;
    
//         if (obj1 == null && obj2 == null)
//             return true;
    
//         var type = typeof obj1;
//         if (type == 'number' || type == 'string' || obj1 instanceof Date) {
//             return obj1 == obj2;
//         }
    
//         if (Array.isArray(obj1)) {
//             if (!Array.isArray(obj2))
//                 return false;
    
//             if (obj1.length != obj2.length)
//                 return false;
    
//             for (let i = 0; i < obj1.length; i++) {
//                 if (!isEquals(obj1[i], obj2[i])) {
//                     return false;
//                 }
//             }
    
//             return true;
//         }
    
//         let keys1 = Object.getOwnPropertyNames(obj1)
//             .filter(o => !skipField(obj1, o))
//             .sort();
//         let keys2 = Object.getOwnPropertyNames(obj2)
//             .filter(o => !skipField(obj2, o))
//             .sort();
    
//         if (!isEquals(keys1, keys2))
//             return false;
    
//         for (let i = 0; i < keys1.length; i++) {
//             let key = keys1[i];
//             let value1 = obj1[key];
//             let value2 = obj2[key];
    
//             if (!isEquals(value1, value2)) {
//                 return false;
//             }
//         }
    
//         return true;
//     }
    

//     function skipField(obj: any, field: string): boolean {
//         return typeof obj[field] == 'function';
//     }
// }