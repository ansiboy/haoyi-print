namespace jueying.forms {
    export interface DocumentStorage {
        list(pageIndex: number, pageSize: number): Promise<{ items: PageDocument[], count: number }>;
        load(name: string): Promise<PageDocument>;
        save(name: string, pageData: PageDocument): Promise<any>;
        remove(name: string): Promise<any>;
    }

    export class LocalDocumentStorage implements DocumentStorage {
        private static prefix = 'pdc_';
        constructor() {
            debugger
        }
        async list(pageIndex, pageSize) {
            if (pageIndex == null) throw Errors.argumentNull('pageIndex');
            if (pageSize == null) throw Errors.argumentNull('pageSize');

            let allItems = new Array<PageDocument>();
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (!key.startsWith(LocalDocumentStorage.prefix)) {
                    continue;
                }

                let name = key.substr(LocalDocumentStorage.prefix.length);
                let value = localStorage[key];
                let doc = JSON.parse(value);
                allItems.push(doc);
            }

            let count = allItems.length;
            let items = allItems.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize)
            return { items, count };
        }
        async load(name: string) {
            let key = `${LocalDocumentStorage.prefix}${name}`;
            let text = localStorage.getItem(key);
            if (text == null)
                return null;

            return JSON.parse(text);
        }
        async save(name: string, pageData: PageDocument) {
            let key = `${LocalDocumentStorage.prefix}${name}`;
            let value = JSON.stringify(pageData);
            localStorage.setItem(key, value);
        }
        async remove(name: string): Promise<any> {
            let key = `${LocalDocumentStorage.prefix}${name}`;
            localStorage.removeItem(key);
        }

    }
}