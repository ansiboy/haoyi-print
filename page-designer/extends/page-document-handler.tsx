
namespace jueying.extentions {
    export class PageDocument {
        private static instances: { [key: string]: PageDocument } = {};
        private storage: DocumentStorage;
        private _pageData: ElementData;
        private originalPageData: ElementData;
        private fileName: string;

        constructor(fileName, storage: DocumentStorage, pageData: ElementData, isNew?: boolean) {
            this.storage = storage;
            this._pageData = pageData;

            isNew = isNew == null ? false : isNew;
            if (isNew)
                this.originalPageData = { type: 'PageView', props: {} };
            else
                this.originalPageData = JSON.parse(JSON.stringify(pageData));

            this.fileName = fileName;
        }

        save() {
            this.originalPageData = JSON.parse(JSON.stringify(this._pageData));
            return this.storage.save(this.fileName, this.originalPageData);
        }

        get isChanged() {
            let equals = isEquals(this.originalPageData, this._pageData);
            return !equals;
        }

        get name() {
            return this.fileName;
        }

        get pageData() {
            return this._pageData;
        }

        static async load(storage: DocumentStorage, fileName: string) {
            // let storage = new LocalDocumentStorage()
            let data = await storage.load(fileName);
            if (data == null) {
                throw Errors.fileNotExists(fileName);
            }

            return new PageDocument(fileName, storage, data);
        }

        static new(storage: DocumentStorage, fileName: string, init: ElementData) {
            // let storage = new LocalDocumentStorage()
            return new PageDocument(fileName, storage, init, true);
        }

    }


}