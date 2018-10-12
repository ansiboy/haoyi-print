export function index() {
    return 'hello world'
}
export function error() {
    let error = new Error('test error')
    throw error
}
