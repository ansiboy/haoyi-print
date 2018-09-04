import { Service } from "../service";

let service = new Service()

export class ServiceDocumentStorage implements jueying.extentions.DocumentStorage {
    list(pageIndex: number, pageSize: number): Promise<{ items: [string, jueying.ElementData][]; count: number; }> {

        return service.templateList().then(r => {
            let items = r.map(o => {
                let b: [string, jueying.ElementData] = [o.name, o.data]
                return b
            })
            return {
                items,
                count: r.length
            }
        })
    }
    load(name: string): Promise<jueying.ElementData | null> {
        return service.templateGet(name)
    }
    save(name: string, pageData: jueying.ElementData): Promise<any> {
        return service.templateSave(name, pageData)
    }
    remove(name: string): Promise<any> {
        throw new Error("Method not implemented.");
    }


}