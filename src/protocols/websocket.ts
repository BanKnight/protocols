import { Type, When } from "..";

/**
 * 参考：https://juejin.cn/post/6963872619632263175
 */
export const Frame = Type.Object()
    .define("fin", Type.Bit())
    .define("rsv1", Type.Bit()) // 1st, 2nd, and 3rd bits of the payload length
    .define("rsv2", Type.Bit())
    .define("rsv3", Type.Bit())
    .define("opcode", Type.Bits(4))
    .define("mask", Type.Bit())
    .define("payloadLength", Type.ULength())
    .define("maskingKey", Type.SubArray(4), When("mask", 1))
    .define("payload", Type.All());