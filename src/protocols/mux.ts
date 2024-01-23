/**
 * 参考： https://xtls.github.io/Xray-docs-next/development/protocols/muxcool.html
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

const New = Types.struct(TypeAddress)
    .switch("protocol", {
        0x01: ["tcp", Types.All()],
        0x02: ["udp", Types.L16BufferBE()],
    })

const KeepAlive = Types.struct(TypeAddress)

export const Meta = Types.struct()
    .define("uid", Types.UInt16BE())
    .define("cmdType", Types.UInt8())
    .switch("cmdType", {
        0x01: ["new", New],
        0x02: ["keep", Types.All()],
        0x03: ["end", Types.Ignore()],
        0x04: ["keepAlive", KeepAlive],
    })

export const Packet = Types.struct()
    .define("meta", Types.L16ObjectBe(Meta))
    .when("meta.opt", 0x01, ["extra", Types.L16BufferBE()])



