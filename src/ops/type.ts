import { Condition, Context, TypeOp } from "./context";

export function UInt8(solid: number = 0) {
    return {
        len: 1,
        read(context: Context) { return context.buffer[context.offset += 1]; },
        write(context: Context, value = solid) { context.buffer[context.offset += 1] = value ?? 0; }
    }
}
export function UInt16BE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt16BE(context.offset += 2); },
        write(context: Context, value = solid) { context.buffer.writeUInt16BE(value ?? 0, context.offset += 2); }
    }
}
export function UInt16LE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt16LE(context.offset += 2); },
        write(context: Context, value = solid) { context.buffer.writeUInt16LE(value ?? 0, context.offset += 2); }
    }
}

export function UInt32BE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt32BE(context.offset += 2); },
        write(context: Context, value = solid) { context.buffer.writeUInt32BE(value ?? 0, context.offset += 2); }
    }
}
export function UInt32LE(solid: number = 0) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readUInt32LE(context.offset += 2); },
        write(context: Context, value = solid) { context.buffer.writeUInt32LE(value ?? 0, context.offset += 2); }
    }
}


export function UInt64BE(solid: bigint = 0n) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readBigUInt64BE(context.offset += 2); },
        write(context: Context, value = solid) { context.buffer.writeBigUInt64BE(value ?? 0, context.offset += 2); }
    }
}
export function UInt64LE(solid: bigint = 0n) {
    return {
        len: 2,
        read(context: Context) { return context.buffer.readBigUInt64LE(context.offset += 2); },
        write(context: Context, value = solid) { context.buffer.writeBigUInt64LE(value ?? 0, context.offset += 2); }
    }
}

export function SubArray(len: number = 0) {
    return {
        len,
        read(context: Context) { return context.buffer.subarray(context.offset, context.offset += len); },
        write(context: Context, value: Buffer = Buffer.alloc(len)) { value.copy(context.buffer, context.offset); context.offset += len }
    }
}
export function L8Buffer() {
    return {
        len: 1,
        read(context: Context) {
            const len = context.buffer.readUInt8(context.offset++);
            return context.buffer.subarray(context.offset, context.offset += len);
        },
        write(context: Context, value: Buffer = Buffer.alloc(0)) {
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
        write(context: Context, value: Buffer) {
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
        write(context: Context, value: Buffer = Buffer.alloc(0)) {
            context.offset = context.buffer.writeUInt16BE(value.length, context.offset);
            context.offset += value.copy(context.buffer, context.offset);
        }
    }
}

export function L16ObjectBe(child: TypeOp) {
    return {
        len: 2 + child.len,
        read(context: Context) {

            const len = context.buffer.readUInt16BE(context.offset += 2);
            const end = context.offset + len;

            if (context.offset + len > context.buffer.length) throw new Error

            const obj = child.read(context);

            context.offset = end

            return obj
        },
        write(context: Context, value = {}) {
            context.offset += 2

            const start = context.offset;
            child.write(context, value);
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
        write(context: Context, value: string = "") {
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
        write(context: Context, value: string = "") {
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
        write(context: Context, value: string = "") {
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
        write(context: Context, value: string = "") {
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
        write(context: Context, value: Buffer = Buffer.alloc(0)) {
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
        write(context: Context, value: Array<any> = []) {
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
        write(context: Context, value: Array<any> = []) {
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
        write(context: Context, value: string = "127.0.0.1") {
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
        write(context: Context, value: string = "") {   //Todo
            const array = value.split(":");
            for (let i = 0; i < 8; i++) {
                base.write(context, parseInt(array[i]!));
            }
        }
    }
}

export const Domain = L8String

export class ObjectType {
    len: number = 0;
    ops = [] as Array<{
        name: string,
        type: TypeOp,
        cond?: Condition | undefined,
    }>
    constructor(...base: Array<ObjectType>) {
        for (const b of base) {
            this.len += b.len;
            this.ops.push(...b.ops);
        }
    }

    concat(...base: Array<ObjectType>) {
        for (const b of base) {
            this.len += b.len;
            this.ops.push(...b.ops);
        }
    }

    define(name: string, type: TypeOp, cond?: Condition) {
        this.ops.push({
            name,
            type,
            cond,
        })

        this.len += cond ? type.len : 0 // 计算最小长度

        return this
    }
    read<T extends Record<string, any>>(context: Context, scope?: T) {
        const obj = {} as T;
        for (const { name, type, cond } of this.ops) {
            if (cond && !cond(context, obj)) {
                continue
            }
            //@ts-ignore
            obj[name] = type.read(context, obj);
        }
        return obj
    }

    //@ts-ignore
    write<T extends Record<string, any>>(context: Context, obj: T = {}, scope?: any) {
        for (const { name, type, cond } of this.ops) {
            if (cond && !cond(context, obj)) {
                continue
            }
            type.write(context, obj[name], scope);
        }
    }
}

export function Object(...base: Array<ObjectType>) {
    return new ObjectType(...base)
}

export function Bit() {
    return {
        len: 1,
        read(context: Context) {
            const val = context.buffer.readUint8(context.offset)
            const bit = 1 << (7 - context.bit) & val

            context.bit++

            return bit
        },
        write(context: Context, value: 1 | 0) {
            const val = context.buffer.readUint8(context.offset)
            const bit = (value << (7 - context.bit))

            context.buffer.writeUint8(context.offset, val | bit)

            context.bit++
        },
    }
}

export function Bits(len: number) {
    return {
        len: Math.ceil(len / 8),
        read(context: Context) {
            const origin = context.buffer.readUint8(context.offset)
            const bits = (origin >> (8 - len - context.bit)) & ((1 << len) - 1)

            context.bit += len

            return bits
        },
        write(context: Context, value: number) {
            const origin = context.buffer.readUint8(context.offset)
            const bit = (value << (8 - len - context.bit))

            context.buffer.writeUint8(context.offset, origin | bit)
            context.bit += len
        }
    }
}

export function ULength() {

    const type1 = Bits(7)
    const type2 = UInt16BE()
    const type3 = UInt64BE()

    return {
        len: 1,
        read(context: Context) {
            const len = type1.read(context)
            if (len < 126) {
                return len
            }
            if (len == 126) {
                return type2.read(context)
            }
            return type3.read(context)
        },
        write(context: Context, value: number = 0) {
            if (value < 126) {
                return type1.write(context, value)
            }
            if (value < 2 ** 16) {
                type1.write(context, 126)
                type2.write(context, value)
                return
            }
            type1.write(context, 127)
            type3.write(context, BigInt(value))
        }
    }
}
