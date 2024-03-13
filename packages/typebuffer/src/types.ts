import { Pipe, Context, Scope, TypeOp, StructOp, Getter, Attribute } from "./type";
import * as Attributes from "./attributes";

import { get, makeOp, opRead, opWrite } from "./utils";

export function UInt8(solid: number = 0) {
    return {
        len: 1,
        read(context: Context) {
            const value = context.buffer.readUint8(context.read);
            context.read += 1
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer[context.write] = value ?? 0;
            context.write += 1
        }
    }
}
export function UInt16BE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) {
            const value = context.buffer.readUInt16BE(context.read);
            context.read += 2
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer.writeUInt16BE(value ?? 0, context.write);
            context.write += 2
        }
    }
}
export function UInt16LE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) {
            const value = context.buffer.readUInt16LE(context.read);
            context.read += 2
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer.writeUInt16LE(value ?? 0, context.write);
            context.write += 2
        }
    }
}

export function UInt32BE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) {
            const value = context.buffer.readUInt32BE(context.read);
            context.read += 2
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer.writeUInt32BE(value ?? 0, context.write);
            context.write += 2
        }
    }
}
export function UInt32LE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) {
            const value = context.buffer.readUInt32LE(context.read);
            context.read += 2
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer.writeUInt32LE(value ?? 0, context.write);
            context.write += 2
        }
    }
}


export function UInt64BE(solid: bigint = 0n) {
    return {
        len: 2,
        read(context: Context) {
            const value = context.buffer.readBigUInt64BE(context.read);
            context.read += 2
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer.writeBigUInt64BE(value ?? 0, context.write);
            context.write += 2
        }
    }
}
export function UInt64LE(solid: bigint = 0n) {
    return {
        len: 2,
        read(context: Context) {
            const value = context.buffer.readBigUInt64LE(context.read);
            context.read += 2
            return value
        },
        write(context: Context, scope: any, value = solid) {
            context.buffer.writeBigUInt64LE(value ?? 0, context.write);
            context.write += 2
        }
    }
}

export function Bytes(len: number = 0) {
    return {
        len,
        read(context: Context) {
            const value = context.buffer.subarray(context.write, context.read);
            context.read += len
            return value
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(len)) {
            context.write += value.copy(context.buffer, context.write, 0, len);
        }
    }
}

/**
 * 以另外一个变量的值作为长度，来读写Buffer
 * 读buffer: 用 scope[name] 作为后续的Buffer长度
 * 写buffer：直接用 value的长度
 * 
 * @param name 
 * @returns 
 */
export function VarBytes(name: string) {
    return {
        len: 0,
        read(context: Context, scope: Scope) {
            const len = get(scope, name) as number
            return context.buffer.subarray(context.read, context.read += len);
        },
        write(context: Context, scope: any, value: Buffer) {
            context.write += value.copy(context.buffer, context.write);
        }
    }
}
export function L8Bytes() {
    const lenOp = UInt8()
    return {
        len: 1,
        read(context: Context) {
            const len = lenOp.read(context)
            return context.buffer.subarray(context.write, context.read += len);
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(0)) {
            lenOp.write(context, scope, value.length)
            context.write += value.copy(context.buffer, context.write);
        }
    }
}
export function L16BytesLE() {
    const lenOp = UInt16LE()
    return {
        len: 2,
        read(context: Context) {
            const len = lenOp.read(context)
            return context.buffer.subarray(context.write, context.read += len);
        },
        write(context: Context, scope: any, value: Buffer) {
            lenOp.write(context, scope, value.length)
            context.write += value.copy(context.buffer, context.write);
        }
    }
}
export function L16BufferBE() {
    const lenOp = UInt16BE()
    return {
        len: 2,
        read(context: Context) {
            const len = lenOp.read(context)
            return context.buffer.subarray(context.write, context.read += len);
        },
        write(context: Context, scope: any, value: Buffer) {
            lenOp.write(context, scope, value.length)
            context.write += value.copy(context.buffer, context.write);
        }
    }
}

/**
 * 长度 + 子对象
 * @param child 
 * @returns 
 */
export function L16ChildBE(child: TypeOp) {
    const lenOp = UInt16BE()
    return {
        len: 2 + child.len,
        read(context: Context, scope: any) {

            const len = lenOp.read(context)
            const end = context.read + len;

            if (end >= context.write) throw new Error

            const obj = child.read(context, scope);

            return obj
        },
        write(context: Context, scope: any, value = {}) {
            const start = context.write;

            context.write += 2
            child.write(context, scope, value);

            const len = context.write - start - 2; // length of child

            context.buffer.writeUInt16BE(len, start);
        }
    }
}

export function String() {
    return {
        read(context: Context) {
            const end = context.write
            const val = context.buffer.toString('utf8', context.read, end);

            context.read = end;

            return val
        },
        write(context: Context, scope: any, value: string = "") {
            context.write += context.buffer.write(value, context.write, 'utf8');
        }
    }
}
export function L8String() {
    const lenOp = UInt8()
    return {
        len: 1,
        read(context: Context) {
            const len = lenOp.read(context)
            return context.buffer.toString('utf8', context.read, context.read += len);
        },
        write(context: Context, scope: any, value: string = "") {
            const len = Buffer.byteLength(value, 'utf8');
            lenOp.write(context, scope, len)
            context.write += context.buffer.write(value, context.write, 'utf8');
        }
    }
}
export function L16StringBE() {
    const lenOp = UInt16BE()
    return {
        len: 1,
        read(context: Context) {
            const len = lenOp.read(context)
            return context.buffer.toString('utf8', context.read, context.read += len);
        },
        write(context: Context, scope: any, value: string = "") {
            const len = Buffer.byteLength(value, 'utf8');
            lenOp.write(context, scope, len)
            context.write += context.buffer.write(value, context.write, 'utf8');
        }
    }
}
export function L16StringLE() {
    const lenOp = UInt16LE()
    return {
        len: 1,
        read(context: Context) {
            const len = lenOp.read(context)
            return context.buffer.toString('utf8', context.read, context.read += len);
        },
        write(context: Context, scope: any, value: string = "") {
            const len = Buffer.byteLength(value, 'utf8');
            lenOp.write(context, scope, len)
            context.write += context.buffer.write(value, context.write, 'utf8');
        }
    }
}
/**
 * 不做任何事，只是增加 offset
 * @param len 
 * @returns 
 */
export function Void(len: number = 0) {
    return {
        len,
        read(context: Context) {
            context.read += len;
        },
        write(context: Context) {
            context.write += len;
        }
    }
}

export function All() {
    return {
        len: 0,
        read(context: Context) {
            const val = context.buffer.subarray(context.read, context.write);
            context.read = context.write;
            return val
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(0)) {
            context.write += value.copy(context.buffer, context.write)
        }
    }
}
/**
 * 按照固定大小的数组来读写
 * @param len 
 * @param item 
 * @returns 
 */
export function Array(len: number, item: TypeOp) {
    return {
        len: item.len * len,
        read(context: Context) {
            const array = [] as Array<any>
            for (let i = 0; i < len; i++) {
                array.push(item.read(context, array))
            }
            return array
        },
        write(context: Context, scope: any, value: Array<any> = []) {
            for (const one of value) {
                item.write(context, one, value)
            }
        }
    }
}

export function L8Array(item: TypeOp) {
    const lenOp = UInt8()

    return {
        len: 0,
        read(context: Context, scope: any) {
            const len = lenOp.read(context)
            const array = [] as Array<any>
            for (let i = 0; i < len; i++) {
                array.push(item.read(context, array))
            }
            return array
        },
        write(context: Context, scope: any, value: Array<any> = []) {
            lenOp.write(context, value.length)
            for (const one of value) {
                item.write(context, one, value)
            }
        }
    }
}

export function IPV4() {
    const base = UInt8()
    return {
        len: base.len * 4,
        read(context: Context) {
            const array = [] as Array<string>
            for (let i = 0; i < 4; i++) {
                array.push(base.read(context)?.toString() ?? "");
            }
            return array.join(".");
        },
        write(context: Context, scope: any, value: string = "127.0.0.1") {
            const array = value.split(".");
            for (let i = 0; i < 4; i++) {
                base.write(context, parseInt(array[i]!));
            }
        }
    }
}

export function IPV6BE() {
    const base = UInt16BE()
    return {
        len: base.len * 8,
        read(context: Context) {
            const array = [] as Array<string>
            for (let i = 0; i < 8; i++) {
                array.push(base.read(context)?.toString());
            }
            return array.join(":");
        },
        write(context: Context, scope: any, value: string = "") {   //Todo
            const array = value.split(":");
            for (let i = 0; i < 8; i++) {
                base.write(context, parseInt(array[i]!));
            }
        }
    }
}

export const Domain = L8String
export function Json() {
    const base = L16StringBE()
    return {
        len: base.len,
        read(context: Context) {
            const content = base.read(context)
            return JSON.parse(content)
        },
        write(context: Context, scope: any, value: any = undefined) {
            const content = JSON.stringify(value)
            base.write(context, scope, content)
        }

    }

}

export class StructType {
    len: number = 0;
    ops: Array<StructOp> = []

    constructor(...base: Array<StructType>) {
        for (const b of base) {
            this.len += b.len;
            this.ops.push(...b.ops);
        }
    }

    concat(...base: Array<StructType>) {
        for (const b of base) {
            this.len += b.len;
            this.ops.push(...b.ops);
        }
        return this
    }

    define(name: string, type: TypeOp): this;
    define(name: string, pipe: Pipe, type: TypeOp): this;
    define(names: Array<string>, pipe: Pipe, type: TypeOp): this; // for arrays of names (e.g. for enums
    define(names: string | Array<string>, pipe: Pipe | TypeOp, type?: TypeOp): this {

        const op = makeOp(names, pipe, type)

        this.ops.push(op)
        this.len += op.type.len

        return this
    }

    select(property: string | Getter,
        cases: Record<keyof any, [
            names: string | Array<string>,
            pipe: Pipe | TypeOp,
            type?: TypeOp
        ]>
    ) {
        const getValue = typeof property == "string" ? (scope: any) => get(scope, property) : property

        let len = Infinity
        const ops: { [key: keyof any]: StructOp } = Object.keys(cases).reduce((p, cond: string) => {
            const oneCase = cases[cond]!
            const op = makeOp(...oneCase)

            len = Math.min(len, op.type.len)

            return Object.assign(p, {
                [cond]: op
            })
        }, {})

        const op: StructOp = {
            attribute: {
                get: getValue,
                set() { },
            },
            pipes: [],
            type: {
                len,
                read: (context: Context, scope: Scope) => {
                    const value = getValue(scope, context)
                    //@ts-ignore
                    const op = ops[value]
                    if (!op) {
                        throw new Error(`Unknown value ${value}`)
                    }
                    return opRead(op, context, scope)
                },
                write: (context: Context, scope: Scope, value: any) => {
                    //@ts-ignore
                    const op = ops[value]
                    if (!op) {
                        throw new Error(`Unknown value ${value}`)
                    }
                    return opWrite(op, context, scope)
                }
            },
        }
        this.ops.push(op)
        this.len += op.type.len// 计算最小长度
        return this
    }

    read<T extends Record<string, any>>(context: Context, scope?: T) {
        const obj = {} as T;
        for (const op of this.ops) {
            opRead(op, context, obj)
        }
        return obj
    }

    //@ts-ignore
    write<T extends Record<string, any>>(context: Context, scope?: any, obj: T = {}) {
        for (const op of this.ops) {
            opWrite(op, context, obj)
        }
    }
}

export function Struct(...base: StructType[]) {
    return new StructType(...base)
}






