import { Types, Context, TypeOp } from "../ops";

const UInt8 = Types.UInt8()
const UInt16 = Types.UInt16BE()
const UInt64BE = Types.UInt64BE()

export const MaskPayloadLength: TypeOp = {
    len: 1,
    read(context: Context) {
        const value = UInt8.read(context);
        const mask = value >> 7;
        let len = value << 1 >> 1;

        if (len < 126) {
            return { mask, payloadLength: len }
        }

        if (len === 126) {
            len = UInt16.read(context);
            return { mask, payloadLength: len }
        }

        if (len === 127) {
            const len = UInt64BE.read(context);
            return { mask, payloadLength: len }
        }
    },
    write(context: Context, { mask, payloadLength }: { mask: number, payloadLength: number | bigint }) {

        if (payloadLength < 126) {
            return UInt8.write(context, (mask << 7) | Number(payloadLength))
        }
        if (payloadLength < 65536) {
            UInt8.write(context, (mask << 7) | 126)
            return UInt16.write(context, (mask << 7) | 126, Number(payloadLength))
        }

        UInt8.write(context, (mask << 7) | 127)

        return UInt64BE.write(context, (mask << 7) | 127, BigInt(payloadLength))
    }
}

/**
 * 参考：https://juejin.cn/post/6963872619632263175
 */
export const Frame = Types.struct()
    .bits({ fin: 1, rsv1: 1, rsv2: 1, rsv3: 1, opcode: 4 }, Types.UInt8())
    .bits({ mask: 1, payloadLength: 7 }, Types.UInt8())
    .define(["mask", "payloadLength"], MaskPayloadLength)
    .when("mask", 1, ["maskingKey", Types.Bytes(4)])
    .define("payload", Types.All())