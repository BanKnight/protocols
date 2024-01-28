import { Pipe, Context, Scope, TypeOp, StructOp, Getter, Attribute } from "./type";
import * as Attributes from "./attributes";

import { get, makeOp, opRead, opWrite } from "./utils";

export function UInt8(solid: number = 0) {
    return {
        len: 1,
        read(context: Context) { return context.buffer.readUint8(context.offset += 1); },
        write(context: Context, scope: any, value = solid) { context.buffer[context.offset += 1] = value ?? 0; }
    }
}
export function UInt16BE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt16BE(context.offset += 2); },
        write(context: Context, scope: any, value = solid) { context.buffer.writeUInt16BE(value ?? 0, context.offset += 2); }
    }
}
export function UInt16LE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt16LE(context.offset += 2); },
        write(context: Context, scope: any, value = solid) { context.buffer.writeUInt16LE(value ?? 0, context.offset += 2); }
    }
}

export function UInt32BE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt32BE(context.offset += 2); },
        write(context: Context, scope: any, value = solid) { context.buffer.writeUInt32BE(value ?? 0, context.offset += 2); }
    }
}
export function UInt32LE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt32LE(context.offset += 2); },
        write(context: Context, scope: any, value = solid) { context.buffer.writeUInt32LE(value ?? 0, context.offset += 2); }
    }
}


export function UInt64BE(solid: bigint = 0n) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readBigUInt64BE(context.offset += 2); },
        write(context: Context, scope: any, value = solid) { context.buffer.writeBigUInt64BE(value ?? 0, context.offset += 2); }
    }
}
export function UInt64LE(solid: bigint = 0n) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readBigUInt64LE(context.offset += 2); },
        write(context: Context, scope: any, value = solid) { context.buffer.writeBigUInt64LE(value ?? 0, context.offset += 2); }
    }
}

export function Bytes(len: number = 0) {
    return {
        len,
        read(context: Context) {
            return context.buffer.subarray(context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(len)) {
            context.offset += value.copy(context.buffer, context.offset, 0, len);
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
            return context.buffer.subarray(context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: Buffer) {
            context.offset += value.copy(context.buffer, context.offset);
        }
    }
}
export function L8Bytes() {
    return {
        len: 1,
        read(context: Context) {
            const len = context.buffer.readUInt8(context.offset++);
            return context.buffer.subarray(context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(0)) {
            context.offset = context.buffer.writeUInt8(value.length, context.offset);
            context.offset += value.copy(context.buffer, context.offset);
        }
    }
}
export function L16BufferLE() {
    return {
        len: 2,
        read(context: Context) {
            const len = context.buffer.readUInt16LE(context.offset += 2);
            return context.buffer.subarray(context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: Buffer) {
            context.offset = context.buffer.writeUInt16LE(value.length, context.offset);
            context.offset += value.copy(context.buffer, context.offset);
        }
    }
}
export function L16BufferBE() {
    return {
        len: 2,
        read(context: Context) {
            const len = context.buffer.readUInt16BE(context.offset += 2);
            return context.buffer.subarray(context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(0)) {
            context.offset = context.buffer.writeUInt16BE(value.length, context.offset);
            context.offset += value.copy(context.buffer, context.offset);
        }
    }
}

/**
 * 长度 + 子对象
 * @param child 
 * @returns 
 */
export function L16ChildBE(child: TypeOp) {
    return {
        len: 2 + child.len,
        read(context: Context, scope: any) {

            const len = context.buffer.readUInt16BE(context.offset += 2);
            const end = context.offset + len;

            if (context.offset + len > context.buffer.length) throw new Error

            const obj = child.read(context, scope);

            context.offset = end

            return obj
        },
        write(context: Context, scope: any, value = {}) {
            context.offset += 2

            const start = context.offset;
            child.write(context, scope, value);
            const len = context.offset - start; // length of object

            context.buffer.writeUInt16BE(len, start - 2);
        }
    }
}

export function String() {
    return {
        read(context: Context) {
            const end = context.buffer.length
            const val = context.buffer.toString('utf8', context.offset, end);
            context.offset = end;

            return val
        },
        write(context: Context, scope: any, value: string = "") {
            context.offset += context.buffer.write(value, context.offset, 'utf8');
        }
    }
}
export function L8String() {
    return {
        len: 1,
        read(context: Context) {
            const len = context.buffer.readUInt8(context.offset += 1);
            return context.buffer.toString('utf8', context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: string = "") {
            const len = Buffer.byteLength(value, 'utf8');
            context.offset = context.buffer.writeUInt8(len, context.offset);
            context.offset += context.buffer.write(value, context.offset, 'utf8');
        }
    }
}
export function L16StringBE() {
    return {
        len: 2,
        read(context: Context) {
            const len = context.buffer.readUInt16BE(context.offset += 2);
            return context.buffer.toString('utf8', context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: string = "") {
            const len = Buffer.byteLength(value, 'utf8');
            context.offset = context.buffer.writeUInt16BE(len, context.offset);
            context.offset += context.buffer.write(value, context.offset, 'utf8');
        }
    }
}
export function L16StringLE() {
    return {
        len: 2,
        read(context: Context) {
            const len = context.buffer.readUInt16LE(context.offset += 2);
            return context.buffer.toString('utf8', context.offset, context.offset += len);
        },
        write(context: Context, scope: any, value: string = "") {
            const len = Buffer.byteLength(value, 'utf8');
            context.offset = context.buffer.writeUInt16LE(len, context.offset);
            context.offset += context.buffer.write(value, context.offset, 'utf8');
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
            context.offset += len;
        },
        write(context: Context) {
            context.offset += len;
        }
    }
}

export function All() {
    return {
        len: 0,
        read(context: Context) {
            const val = context.buffer.subarray(context.offset);
            context.offset = context.buffer.length;
            return val
        },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(0)) {
            context.offset += value.copy(context.buffer, context.offset)
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
    return {
        len: 0,
        read(context: Context, scope: any) {
            const len = context.buffer.readUInt8(context.offset++);
            const array = [] as Array<any>
            for (let i = 0; i < len; i++) {
                array.push(item.read(context, array))
            }
            return array
        },
        write(context: Context, scope: any, value: Array<any> = []) {
            context.buffer.writeUInt8(value.length, context.offset++);
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

class StructBase {
    len: number = 0;
    ops: Array<StructOp> = []

    constructor(...base: Array<StructBase>) {
        for (const b of base) {
            this.len += b.len;
            this.ops.push(...b.ops);
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
            attribute: Attributes.Skip(),
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
                write: (context: Context, scope: Scope) => {
                    const value = getValue(scope, context)
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




