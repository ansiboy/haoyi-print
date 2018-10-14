import { Service } from "../service";
import { ComponentData } from "jueying";
import { PageDocument } from "jueying.forms";

let service = new Service()

export class ServiceDocumentStorage {
    list(pageIndex: number, pageSize: number): Promise<{ items: PageDocument[]; count: number; }> {

        return service.templateList().then(r => {
            // let items = r.map(o => {
            //     let b: PageDocument = [o.name, o.data]
            //     return b
            // })
            return {
                items: r,
                count: r.length
            }
        })
    }
    load(name: string): Promise<PageDocument | null> {
        return service.templateGet(name)
    }
    save(name: string, pageData: PageDocument): Promise<any> {
        return service.templateSave(name, pageData)
    }
    remove(name: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}