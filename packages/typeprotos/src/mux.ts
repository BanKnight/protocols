/**
 * 参考： https://xtls.github.io/Xray-docs-next/development/protocols/muxcool.html
 */
import { Types } from "typebuffer";

export const TypeAddress = Types.Struct()
    .define("protocol", Types.UInt8())       //0x1: tcp, 0x2:udp
    .define("port", Types.L16BufferBE())
    .define("family", Types.UInt8())
    .select("family", {
        0x01: ["ipv4", Types.IPV4()],
        0x02: ["domain", Types.Domain()],
        0x03: ["ipv6", Types.IPV6BE()],
    })

const New = Types.Struct(TypeAddress)
    .select("protocol", {
        0x01: ["tcp", Types.All()],
        0x02: ["udp", Types.L16BufferBE()],
    })

const KeepAlive = Types.Struct(TypeAddress)

export const Meta = Types.Struct()
    .define("uid", Types.UInt16BE())
    .define("cmdType", Types.UInt8())
    .select("cmdType", {
        0x01: ["new", New],
        0x02: ["keep", Types.All()],
        0x03: ["end", Types.Void()],
        0x04: ["keepAlive", KeepAlive],
    })
    .select("meta.opt", {
        0x01: ["cmdType", Types.UInt8()],
    })

export const Packet = Types.Struct()
    .define("meta", Types.L16ChildBE(Meta))
    .select("meta.opt", {
        0x01: ["extra", Types.L16BufferBE()],
    })




