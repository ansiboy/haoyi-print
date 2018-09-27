namespace jueying.extentions {
    export interface DocumentStorage {
        list(pageIndex: number, pageSize: number): Promise<{ items: [string, ComponentData][], count: number }>;
        load(name: string): Promise<ComponentData>;
        save(name: string, pageData: ComponentData): Promise<any>;
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

            let allItems = new Array<[string, ComponentData]>();
            for (let i = 0; i < localStorage.length; i++) {
                let key = localStorage.key(i);
                if (!key.startsWith(LocalDocumentStorage.prefix)) {
                    continue;
                }

                let name = key.substr(LocalDocumentStorage.prefix.length);
                let value = localStorage[key];
                let doc = JSON.parse(value);
                allItems.push([name, doc]);
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
        async save(name: string, pageData: ComponentData) {
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