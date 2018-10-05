import { Service } from "../service";
import { ComponentData } from "jueying";
import { DocumentStorage } from "jueying.forms";

let service = new Service()

export class ServiceDocumentStorage implements DocumentStorage {
    list(pageIndex: number, pageSize: number): Promise<{ items: [string, ComponentData][]; count: number; }> {

        return service.templateList().then(r => {
            let items = r.map(o => {
                let b: [string, ComponentData] = [o.name, o.data]
                return b
            })
            return {
                items,
                count: r.length
            }
        })
    }
    load(name: string): Promise<ComponentData | null> {
        return service.templateGet(name)
    }
    save(name: string, pageData: ComponentData): Promise<any> {
        return service.templateSave(name, pageData)
    }
    remove(name: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}