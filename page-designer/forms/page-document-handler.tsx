
namespace jueying.forms {
    export class PageDocument {
        private storage: DocumentStorage;
        private _pageData: ComponentData;
        private originalPageData: ComponentData;
        private _fileName: string;

        constructor(fileName, storage: DocumentStorage, pageData: ComponentData, isNew?: boolean) {
            this.storage = storage;
            this._pageData = pageData;

            isNew = isNew == null ? false : isNew;
            if (isNew)
                this.originalPageData = { type: 'PageView', props: {} };
            else
                this.originalPageData = JSON.parse(JSON.stringify(pageData));

            this._fileName = fileName;
        }

        save() {
            this.originalPageData = JSON.parse(JSON.stringify(this._pageData));
            return this.storage.save(this._fileName, this.originalPageData);
        }

        get notSaved() {
            let equals = isEquals(this.originalPageData, this._pageData);
            return !equals;
        }

        get fileName() {
            return this._fileName;
        }

        get pageData() {
            return this._pageData;
        }
        set pageData(value) {
            this._pageData = value
        }

        static async load(storage: DocumentStorage, fileName: string) {
            // let storage = new LocalDocumentStorage()
            let data = await storage.load(fileName);
            if (data == null) {
                throw Errors.fileNotExists(fileName);
            }

            return new PageDocument(fileName, storage, data);
        }

        static new(storage: DocumentStorage, fileName: string, init: ComponentData) {
            // let storage = new LocalDocumentStorage()
            return new PageDocument(fileName, storage, init, true);
        }

    }


}