import { Converter, Scope } from "./type";
import { get, set } from "./utils";

export function Bits(config: Record<string, number>): Converter {
    return {
        toScope(scope: Scope, value: any) {
            let offset = 0
            for (let key in config) {
                const l = config[key]!
                const v = (value >> (8 - l - offset)) & ((1 << l) - 1)

                set(scope, key, v)
                offset += l
            }
        },
        toBuffer(scope): number {
            let value = 0
            let offset = 0

            for (let key in config) {
                const l = config[key]!
                const v = get(scope, key)!

                value |= (v << (8 - l - offset))
                offset += l
            }

            return value
        },
    }
}
export function Single(key: string): Converter {
    return {
        toScope(scope: Scope, value: any) {
            set(scope, key, value)
        },
        toBuffer(scope): any {
            return get(scope, key)
        }
    }
}

export function Many(...keys: Array<string>) {
    return {
        toScope(scope: Scope, value: any) {
            keys.forEach(
                (key, index) => set(scope, key, value[index])
            )
        },
        toBuffer(scope: Scope): any {
            return keys.map(key => get(scope, key))
        }
    }
}

export function Empty() {
    return {
        toScope() { },
        toBuffer() { }
    }
}
