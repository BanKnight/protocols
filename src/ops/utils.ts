export function Always() {
    return () => true
}
export function Never() {
    return () => false
}
export function When(name: string, value: any) {
    return (_: any, scope: any) => {
        return scope[name] == value;
    }
}