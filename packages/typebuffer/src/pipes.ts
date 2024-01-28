import { Pipe, Scope } from "./type";

export function Bits(...lens: Array<number>): Pipe {
    return {
        fromLeft(array: Array<number>, scope: Scope): number {

            let value = 0
            let offset = 0

            for (let i = 0; i < array.length; i++) {
                const v = array[i]!
                const l = lens[i]!

                value |= (v << (8 - l - offset))
                offset += l
            }
            return value
        },
        fromRight(value: number, scope: Scope) {
            let offset = 0
            const ret = []
            for (let i = 0; i < lens.length; i++) {
                const l = lens[i]!
                const v = (value >> (8 - l - offset)) & ((1 << l) - 1)
                ret.push(v)
                offset += l
            }
            return ret
        },
    }
}

export function Empty(): Pipe {
    return {
        fromLeft(value: any, scope: Scope) { return value },
        fromRight(value: any, scope: Scope) { return value },
    }
}