
namespace jueying.forms {
    export class PageDocumentFile {
        private storage: DocumentStorage;
        private _document: PageDocument;
        private originalPageData: PageDocument;
        private _fileName: string;

        constructor(fileName: string, storage: DocumentStorage, document: PageDocument) {
            this.storage = storage;
            this._document = document;
            this.originalPageData = JSON.parse(JSON.stringify(document));
            this._fileName = fileName;
        }

        save() {
            this.originalPageData = JSON.parse(JSON.stringify(this._document));
            return this.storage.save(this._fileName, this._document);
        }

        get notSaved() {
            let equals = isEquals(this.originalPageData, this._document);
            return !equals;
        }

        get fileName() {
            return this._fileName;
        }

        get document() {
            return this._document;
        }
        set document(value) {
            this._document = value
        }

        static async load(storage: DocumentStorage, fileName: string) {
            // let storage = new LocalDocumentStorage()
            let data = await storage.load(fileName);
            if (data == null) {
                throw Errors.fileNotExists(fileName);
            }

            return new PageDocumentFile(fileName, storage, data);
        }

        static new(storage: DocumentStorage, fileName: string, init: PageDocument) {
            // let storage = new LocalDocumentStorage()
            return new PageDocumentFile(fileName, storage, init);
        }

    }


}