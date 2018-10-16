import { PageDocument } from "jueying.forms";
import { Service } from "./service";

export interface DocumentStorage {
    list(pageIndex: number, pageSize: number): Promise<{ items: PageDocument[], count: number }>;
    load(name: string): Promise<PageDocument>;
    save(pageData: PageDocument): Promise<any>;
    remove(name: string): Promise<any>;
}

let service = new Service()
export class DocumentFileStorage implements DocumentStorage {
    list(pageIndex: number, pageSize: number): Promise<{ items: PageDocument[]; count: number; }> {

        return service.documentList().then(r => {
            return {
                items: r,
                count: r.length
            }
        })
    }

    load(name: string): Promise<PageDocument | null> {
        return service.documentGet(name)
    }
    save(pageData: PageDocument): Promise<any> {
        return service.documentSave(pageData)
    }
    remove(name: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
}