import { Attribute, Scope } from "./type"
import { get, set } from "./utils";

export function Single(key: string): Attribute {
    return {
        set(scope: Scope, value: any) {
            set(scope, key, value)
        },
        get(scope): any {
            return get(scope, key)
        }
    }
}

export function Many(keys: Array<string>): Attribute {
    return {
        set(scope: Scope, value: Array<any>) {
            keys.forEach((key, index) => set(scope, key, value[index]))
        },
        get(scope: Scope): Array<any> {
            return keys.map(key => get(scope, key))
        }
    }
}

export function Skip() {
    return {
        set() { },
        get() { return true }
    }
}