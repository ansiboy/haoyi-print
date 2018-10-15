import { PageDocument } from "jueying.forms";
import { Errors, ComponentData } from "jueying";
import { JSONUndoRedo } from "./json-undo-redo";
import { DocumentStorage } from "./document-storage";



export class FileDocument {

    pageData: ComponentData;
    private name: string;
    // plugin?: string;

    private storage: DocumentStorage;
    private originalPageData: ComponentData;
    private changedManage: JSONUndoRedo;

    constructor(storage: DocumentStorage, filename: string, pageData: ComponentData) {
        if (!storage) throw Errors.argumentNull('storage')
        if (!pageData) throw Errors.argumentNull('pageData')


        this.storage = storage;
        this.name = this.fileName
        // console.assert(document.pageData)
        this.originalPageData = JSON.parse(JSON.stringify(pageData));

        this.pageData = pageData;
        // this.name = document.name;
        // this.plugin = document.plugin;
        this.changedManage = new JSONUndoRedo(this.pageData)
    }

    setSnapShoot(pageData: ComponentData) {
        if (isEquals(pageData, this.changedManage.currentData)) {
            return
        }
        this.originalPageData = JSON.parse(JSON.stringify(pageData));
        this.changedManage.setChangedData(pageData)
    }

    save(document: PageDocument) {
        this.originalPageData = JSON.parse(JSON.stringify(document.pageData));
        return this.storage.save(this.name, document);
    }

    get canSave() {
        let equals = isEquals(this.originalPageData, this.pageData);
        return !equals;
    }

    get fileName() {
        return this.name;
    }

    get canUndo() {
        return this.changedManage.canUndo
    }

    get canRedo() {
        return this.changedManage.canRedo
    }

    undo(): ComponentData {
        let pageData = this.changedManage.undo()
        console.assert(pageData)
        return pageData
    }

    redo(): ComponentData {
        let pageData = this.changedManage.redo()
        console.assert(pageData)
        return pageData
    }

    static async load(storage: DocumentStorage, fileName: string) {
        let data = await storage.load(fileName);
        if (data == null) {
            throw Errors.fileNotExists(fileName);
        }

        // return new FileDocument(storage, fileName, data.pageData);
        data.name = fileName
        return data
    }

    static new(storage: DocumentStorage, fileName: string, init: PageDocument) {
        return new FileDocument(storage, fileName, init.pageData);
    }

}

function isEquals(obj1: object, obj2: object) {

    if ((obj1 == null && obj2 != null) || (obj1 != null && obj2 == null))
        return false;

    if (obj1 == null && obj2 == null)
        return true;

    var type = typeof obj1;
    if (type == 'number' || type == 'string' || obj1 instanceof Date) {
        return obj1 == obj2;
    }

    if (Array.isArray(obj1)) {
        if (!Array.isArray(obj2))
            return false;

        if (obj1.length != obj2.length)
            return false;

        for (let i = 0; i < obj1.length; i++) {
            if (!isEquals(obj1[i], obj2[i])) {
                return false;
            }
        }

        return true;
    }

    let keys1 = Object.getOwnPropertyNames(obj1)
        .filter(o => !skipField(obj1, o))
        .sort();
    let keys2 = Object.getOwnPropertyNames(obj2)
        .filter(o => !skipField(obj2, o))
        .sort();

    if (!isEquals(keys1, keys2))
        return false;

    for (let i = 0; i < keys1.length; i++) {
        let key = keys1[i];
        let value1 = obj1[key];
        let value2 = obj2[key];

        if (!isEquals(value1, value2)) {
            return false;
        }
    }

    return true;
}

function skipField(obj: any, field: string): boolean {
    return typeof obj[field] == 'function';
}

