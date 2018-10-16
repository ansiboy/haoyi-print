export class Errors {
    static fileNotExists(fileName: string): any {
        return new Error(`File '${fileName}' not implemented.`);
    }
    static errorDocumentType(type: string) {
        return new Error(`Document type error, '${type}' type expected`)
    }
    static argumentNull(name: string) {
        return new Error(`Argument '${name}' is null or empty`)
    }
}