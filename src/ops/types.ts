import { Converter, Context, Scope, TypeOp, ObjectOp, Getter } from "./type";
import * as Converters from "./converters";
import { get, set } from "./utils";

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
        read(context: Context) { return context.buffer.subarray(context.offset, context.offset += len); },
        write(context: Context, scope: any, value: Buffer = Buffer.alloc(len)) { value.copy(context.buffer, context.offset); context.offset += len }
    }
}
export function L8Buffer() {
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

export function L16ObjectBe(child: TypeOp) {
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
export function Ignore(len: number = 0) {
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

export class StructType {
    len: number = 0;
    ops: Array<ObjectOp> = []

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

    define(name: string | Array<string> | Converter, type: TypeOp): this {
        const op = this.makeOp(name, type)

        this.ops.push(op)
        this.len += op.type.len

        return this
    }

    bits(schema: Record<string, number>, type: TypeOp) {
        return this.define(Converters.Bits(schema), type)
    }

    private makeOp(name: string | Array<string> | Converter, type: TypeOp): ObjectOp {
        const op = { type } as any
        if (typeof name == "string") {
            op.converter = Converters.Single(name)
        }
        else if (name instanceof Array) {
            //@ts-ignore
            op.converter = Converters.Many(...name)
        }
        else {
            op.converter = name
        }

        return op
    }

    private opRead(op: ObjectOp, context: Context, scope: Scope) {
        const value = op.type.read(context, scope)
        op.converter.toScope(scope, value, context)
    }

    private opWrite(op: ObjectOp, context: Context, scope: Scope) {
        const value = op.converter.toBuffer(scope, context)
        if (!value) {
            return
        }
        op.type.write(context, scope, value)
    }

    when(property: string | Getter, cond: any, then: [string | Converter, TypeOp]) {

        const getValue = typeof property == "string" ? (scope: any) => get(scope, property) : property
        const thenOp = this.makeOp(then[0], then[1])

        const op = {
            converter: Converters.Empty(),
            type: {
                len: 0,
                read: (context: Context, scope: Scope) => {
                    const value = getValue(scope, context)
                    if (value == cond) {
                        return this.opRead(thenOp, context, scope)
                    }
                },
                write: (context: Context, scope: Scope) => {
                    const value = getValue(scope, context)
                    if (value == cond) {
                        return this.opWrite(thenOp, context, scope)
                    }
                }
            }
        }

        this.ops.push(op)

        this.len += op.type.len// 计算最小长度

        return this
    }

    switch(property: string | Getter, cases: Record<keyof any, [string | Converter, TypeOp]>) {

        const getValue = typeof property == "string" ? (scope: any) => get(scope, property) : property

        const ops = Object.keys(cases).reduce((p, c) => {
            //@ts-ignore
            return Object.assign(p, { [c]: this.makeOp(cases[c][0], cases[c][1]) }
            )
        }, {} as { [key: keyof any]: ObjectOp })

        const op = {
            converter: Converters.Empty(),
            type: {
                len: Object.keys(ops).reduce((p, c) => Math.min(p + (ops[c]?.type.len ?? 0)), Infinity),
                read: (context: Context, scope: Scope) => {
                    const value = getValue(scope, context)
                    //@ts-ignore
                    const op = ops[value]
                    if (!op) {
                        throw new Error(`Unknown value ${value}`)
                    }
                    return this.opRead(op, context, scope)
                },
                write: (context: Context, scope: Scope) => {
                    const value = getValue(scope, context)
                    //@ts-ignore
                    const op = ops[value]
                    if (!op) {
                        throw new Error(`Unknown value ${value}`)
                    }
                    return this.opWrite(op, context, scope)
                }
            }
        }

        this.ops.push(op)

        this.len += op.type.len// 计算最小长度

        return this
    }

    read<T extends Record<string, any>>(context: Context, scope?: T) {
        const obj = {} as T;
        for (const op of this.ops) {
            this.opRead(op, context, obj)
        }
        return obj
    }

    //@ts-ignore
    write<T extends Record<string, any>>(context: Context, scope?: any, obj: T = {}) {
        for (const op of this.ops) {
            this.opWrite(op, context, obj)
        }
    }
}

export function struct(...base: Array<StructType>) {
    return new StructType(...base)
}

// export function Bit() {
//     return {
//         len: 1,
//         read(context: Context) {
//             const val = context.buffer.readUint8(context.offset)
//             const bit = 1 << (7 - context.bit) & val

//             context.bit++

//             return bit
//         },
//         write(context: Context, value: 1 | 0) {
//             const val = context.buffer.readUint8(context.offset)
//             const bit = (value << (7 - context.bit))

//             context.buffer.writeUint8(context.offset, val | bit)

//             context.bit++
//         },
//     }
// }

// export function ULength() {

//     const type1 = Bits(7)
//     const type2 = UInt16BE()
//     const type3 = UInt64BE()

//     return {
//         len: 1,
//         read(context: Context) {
//             const len = type1.read(context)
//             if (len < 126) {
//                 return len
//             }
//             if (len == 126) {
//                 return type2.read(context)
//             }
//             return type3.read(context)
//         },
//         write(context: Context, value: number = 0) {
//             if (value < 126) {
//                 return type1.write(context, value)
//             }
//             if (value < 2 ** 16) {
//                 type1.write(context, 126)
//                 type2.write(context, value)
//                 return
//             }
//             type1.write(context, 127)
//             type3.write(context, BigInt(value))
//         }
//     }
// }




