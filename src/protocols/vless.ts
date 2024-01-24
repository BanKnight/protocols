/**
 * 参考： https://xtls.github.io/Xray-docs-next/development/protocols/vless.html
 */

import { Types } from "../ops";

export const TypeAddress = Types.struct()
    .define("protocol", Types.UInt8())       //0x1: tcp, 0x2:udp
    .define("port", Types.L16BufferBE())
    .define("family", Types.UInt8())
    .switch("family", {
        0x01: ["ipv4", Types.IPV4()],
        0x02: ["domain", Types.Domain()],
        0x03: ["ipv6", Types.IPV6BE()],
    })

export const Success = Types.struct()
    .define("version", Types.UInt8(0))
    .define("error", Types.UInt8(0))

export const HandShake = Types.struct()
    .define("version", Types.UInt8())
    .define("uuid", Types.Bytes(16))
    .define("opt", Types.L8Buffer())      //opt buffer
    .define("cmd", Types.UInt8())

export const Packet = Types.struct(HandShake)
    .switch("cmd", {
        0x01: ["tcp", Types.All()],
        0x02: ["udp", Types.L16BufferBE()],
        0x03: ["mux", Types.All()],
    })





