export class Errors extends jueying.Errors {
    static errorDocumentType(type: string) {
        return new Error(`Document type error, '${type}' type expected`)
    }
}