export class Errors {
    static errorDocumentType(type: string) {
        return new Error(`Document type error, '${type}' type expected`)
    }
    static argumentNull(name: string) {
        return new Error(`Argument '${name}' is null or empty`)
    }
    static fieldNull(field: string, objectName: string) {
        return new Error(`Field  of '${objectName}', '${field}' is null or empty`)
    }
}